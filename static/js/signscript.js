//sketch lib
(function () {
    var __slice = [].slice;

    (function ($) {
        var Sketch;
        $.fn.sketch = function () {
            var args, key, sketch;
            key = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
            if (this.length > 1) {
                $.error('Sketch.js can only be called on one element at a time.');
            }
            sketch = this.data('sketch');
            if (typeof key === 'string' && sketch) {
                if (sketch[key]) {
                    if (typeof sketch[key] === 'function') {
                        return sketch[key].apply(sketch, args);
                    } else if (args.length === 0) {
                        return sketch[key];
                    } else if (args.length === 1) {
                        return sketch[key] = args[0];
                    }
                } else {
                    return $.error('Sketch.js did not recognize the given command.');
                }
            } else if (sketch) {
                return sketch;
            } else {
                this.data('sketch', new Sketch(this.get(0), key));
                return this;
            }
        };
        Sketch = (function () {

            function Sketch(el, opts) {
                this.el = el;
                this.canvas = $(el);
                this.context = el.getContext('2d');
                this.options = $.extend({
                    toolLinks: true,
                    defaultTool: 'marker',
                    defaultColor: '#000000',
                    defaultSize: 2
                }, opts);
                this.painting = false;
                this.color = this.options.defaultColor;
                this.size = this.options.defaultSize;
                this.tool = this.options.defaultTool;
                this.actions = [];
                this.action = [];
                this.canvas.bind('click mousedown mouseup mousemove mouseleave mouseout touchstart touchmove touchend touchcancel', this.onEvent);
                if (this.options.toolLinks) {
                    $('body').delegate("a[href=\"#" + (this.canvas.attr('id')) + "\"]", 'click', function (e) {
                        var $canvas, $this, key, sketch, _i, _len, _ref;
                        $this = $(this);
                        $canvas = $($this.attr('href'));
                        sketch = $canvas.data('sketch');
                        _ref = ['color', 'size', 'tool'];
                        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                            key = _ref[_i];
                            if ($this.attr("data-" + key)) {
                                sketch.set(key, $(this).attr("data-" + key));
                            }
                        }
                        if ($(this).attr('data-download')) {
                            sketch.download($(this).attr('data-download'));
                        }
                        return false;
                    });
                }
            }

            Sketch.prototype.download = function (format) {
                var mime;
                format || (format = "png");
                if (format === "jpg") {
                    format = "jpeg";
                }
                mime = "image/" + format;
                return window.open(this.el.toDataURL(mime));
            };

            Sketch.prototype.set = function (key, value) {
                this[key] = value;
                return this.canvas.trigger("sketch.change" + key, value);
            };

            Sketch.prototype.startPainting = function () {
                this.painting = true;
                return this.action = {
                    tool: this.tool,
                    color: this.color,
                    size: parseFloat(this.size),
                    events: []
                };
            };


            Sketch.prototype.stopPainting = function () {
                if (this.action) {
                    this.actions.push(this.action);
                }
                this.painting = false;
                this.action = null;
                return this.redraw();
            };

            Sketch.prototype.onEvent = function (e) {
                if (e.originalEvent && e.originalEvent.targetTouches) {
                    e.pageX = e.originalEvent.targetTouches[0].pageX;
                    e.pageY = e.originalEvent.targetTouches[0].pageY;
                }
                $.sketch.tools[$(this).data('sketch').tool].onEvent.call($(this).data('sketch'), e);
                e.preventDefault();
                return false;
            };

            Sketch.prototype.redraw = function () {
                var sketch;
                //this.el.width = this.canvas.width();
                this.context = this.el.getContext('2d');
                sketch = this;
                $.each(this.actions, function () {
                    if (this.tool) {
                        return $.sketch.tools[this.tool].draw.call(sketch, this);
                    }
                });
                if (this.painting && this.action) {
                    return $.sketch.tools[this.action.tool].draw.call(sketch, this.action);
                }
            };

            return Sketch;

        })();
        $.sketch = {
            tools: {}
        };
        $.sketch.tools.marker = {
            onEvent: function (e) {
                switch (e.type) {
                    case 'mousedown':
                    case 'touchstart':
                        if (this.painting) {
                            this.stopPainting();
                        }
                        this.startPainting();
                        break;
                    case 'mouseup':
                        //return this.context.globalCompositeOperation = oldcomposite;
                    case 'mouseout':
                    case 'mouseleave':
                    case 'touchend':
                        //this.stopPainting();
                    case 'touchcancel':
                        this.stopPainting();
                }
                if (this.painting) {
                    this.action.events.push({
                        x: e.pageX - this.canvas.offset().left,
                        y: e.pageY - this.canvas.offset().top,
                        event: e.type
                    });
                    return this.redraw();
                }
            },
            draw: function (action) {
                var event, previous, _i, _len, _ref;
                this.context.lineJoin = "round";
                this.context.lineCap = "round";
                this.context.beginPath();
                this.context.moveTo(action.events[0].x, action.events[0].y);
                _ref = action.events;
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    event = _ref[_i];
                    this.context.lineTo(event.x, event.y);
                    previous = event;
                }
                this.context.strokeStyle = action.color;
                this.context.lineWidth = action.size;
                return this.context.stroke();
            }
        };
        return $.sketch.tools.eraser = {
            onEvent: function (e) {
                return $.sketch.tools.marker.onEvent.call(this, e);
            },
            draw: function (action) {
                var oldcomposite;
                oldcomposite = this.context.globalCompositeOperation;
                this.context.globalCompositeOperation = "destination-out";
                action.color = "rgba(0,0,0,1)";
                $.sketch.tools.marker.draw.call(this, action);
                return this.context.globalCompositeOperation = oldcomposite;
            }
        };
    })(jQuery);

}).call(this);


(function ($) {
    $.fn.SignaturePad = function (options) {

        //update the settings
        var settings = $.extend({
            allowToSign: true,
            img64: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
            border: '1px solid #c7c8c9',
            width: '300px',
            height: '150px',
            callback: function () {
                return true;
            }
        }, options);

        //control should be a textbox
        //loop all the controls
        var id = 0;

        //add a very big pad
        var big_pad = $('#signPadBig');
        var back_drop = $('#signPadBigBackDrop');
        var canvas = undefined;
        if (big_pad.length == 0) {

            back_drop = $('<div>')
            back_drop.css('position', 'fixed');
            back_drop.css('top', '0');
            back_drop.css('right', '0');
            back_drop.css('bottom', '0');
            back_drop.css('left', '0');
            back_drop.css('z-index', '1040 !important');
            back_drop.css('background-color', '#000');
            back_drop.css('display', 'none');
            back_drop.css('filter', 'alpha(opacity=50)');
            back_drop.css('opacity', '0.5');
            $('body').append(back_drop);

            big_pad = $('<div>');
            big_pad.css('display', 'none');
            big_pad.css('position', 'fixed');
            big_pad.css('margin', '0 auto');
            big_pad.css('top', '0');
            big_pad.css('bottom', '0');
            big_pad.css('right', '0');
            big_pad.css('left', '0');
            big_pad.css('z-index', '1000002 !important');
            big_pad.css('overflow', 'hidden');
            big_pad.css('outline', '0');
            big_pad.css('-webkit-overflow-scrolling', 'touch');

            big_pad.css('right', '0');
            big_pad.css('border', '1px solid #c8c8c8');
            big_pad.css('padding', '15px');
            big_pad.css('background-color', 'white');
            big_pad.css('margin-top', '15px');
            big_pad.css('width', '50%');
            big_pad.css('height', '50%');
            big_pad.css('border-radius', '10px');
            big_pad.attr('id', 'signPadBig');
            $('body').append(big_pad);

            var update_canvas_size = function () {
                var w = big_pad.width() //* 0.95;
                var h = big_pad.height() - 55;

                canvas.attr('width', w);
                canvas.attr('height', h);
            }


            canvas = $('<canvas>');
            canvas.css('display', 'block');
            canvas.css('margin', '0 auto');
            canvas.css('border', '1px solid #c8c8c8');
            canvas.css('border-radius', '10px');
            //canvas.css('width', '90%');
            //canvas.css('height', '80%');
            big_pad.append(canvas);

            update_canvas_size();
            $(window).on('resize', function () {
                update_canvas_size();
            });

            var clearCanvas = function () {
                canvas.sketch().action = null;
                canvas.sketch().actions = [];       // this line empties the actions.
                var ctx = canvas[0].getContext("2d");
                ctx.clearRect(0, 0, canvas[0].width, canvas[0].height);
                return true
            }

            var _get_base64_value = function () {
                var text_control = $.data(big_pad[0], 'control');  //settings.control; // $('#' + big_pad.attr('id'));
                return $(text_control).val();
            }

            var copyCanvas = function () {
                //get data from bigger pad
                var sigData = canvas[0].toDataURL("image/png");

                var _img = new Image;
                _img.onload = resizeImage;
                _img.src = sigData;

                var targetWidth = canvas.width();
                var targetHeight = canvas.height();

                function resizeImage() {
                    var imageToDataUri = function (img, width, height) {

                        // create an off-screen canvas
                        var canvas = document.createElement('canvas'),
                            ctx = canvas.getContext('2d');

                        // set its dimension to target size
                        canvas.width = width;
                        canvas.height = height;

                        // draw source image into the off-screen canvas:
                        ctx.drawImage(img, 0, 0, width, height);

                        // encode image to data-uri with base64 version of compressed image
                        return canvas.toDataURL();
                    }

                    var newDataUri = imageToDataUri(this, targetWidth, targetHeight);
                    var control_img = $.data(big_pad[0], 'img');
                    if (control_img)
                        $(control_img).attr("src", newDataUri);

                    var text_control = $.data(big_pad[0], 'control');  //settings.control; // $('#' + big_pad.attr('id'));
                    if (text_control)
                        $(text_control).val(newDataUri);
                }
            }

            var buttons = [
                 {
                     title: 'Close',
                     callback: function () {
                         clearCanvas();
                         big_pad.slideToggle(function () {
                             back_drop.hide('fade');
                         });

                     }
                 },
                 {
                     title: 'Clear',
                     callback: function () {
                         clearCanvas();
                         if (settings.callback)
                             settings.callback(_get_base64_value(), 'clear');
                     }
                 },

                 {
                     title: 'Accept',
                     callback: function () {
                         copyCanvas();
                         clearCanvas();
                         big_pad.slideToggle(function () {
                             back_drop.hide('fade', function () {
                                 if (settings.callback)
                                     settings.callback(_get_base64_value(), 'accept');
                             });
                         });
                     }
                 }].forEach(function (e) {
                     var btn = $('<button>');
                     btn.attr('type', 'button');
                     btn.css('border', '1px solid #c8c8c8');
                     btn.css('background-color', 'white');
                     btn.css('padding', '10px');
                     btn.css('display', 'block');
                     btn.css('margin-top', '15px');
                     btn.css('margin-right', '5px');
                     btn.css('cursor', 'pointer');
                     btn.css('border-radius', '5px');
                     btn.css('float', 'right');
                     btn.css('height', '40px');
                     btn.text(e.title);
                     btn.on('click', function () {
                         e.callback(e.title);
                     })
                     big_pad.append(btn);

                 });

        }
        else {
            canvas = big_pad.find('canvas')[0];
        }

        //init the signpad
        if (canvas) {
            var sign1big = $(canvas).sketch({ defaultColor: "#000", defaultSize: 5 });
        }

        //for each control
        return this.each(function () {

            var control = $(this);
            control.hide();

            //get the control parent
            var wrapper = control.parent();
            var img = $('<img>');

            //style it
            img.css("cursor", "pointer");
            img.css("border", settings.border);
            img.css("height", settings.height);
            img.css("width", settings.width);
            img.css('border-radius', '5px')
            img.attr("src", settings.img64);

            if (typeof (wrapper) == 'object') {
                wrapper.append(img);
            }




            //init the big sign pad
            if (settings.allowToSign == true) {
                //click to the pad bigger
                img.on('click', function () {
                    //show the pad
                    back_drop.show();
                    big_pad.slideToggle();

                    //save control to use later
                    $.data(big_pad[0], 'img', img);
                    $.data(big_pad[0], 'control', control);

                    //settings.control = control;
                    //settings.img = img;
                });
            }
        });
    };


})(jQuery);