'use strict';

function Colour() {
    this.r = 0;
    this.g = 0;
    this.b = 0;
    var self = this;

    this.red = function red() {
        return self.r;
    }

    this.green = function green() {
        return self.g;
    }

    this.blue = function blue() {
        return self.b;
    }

    this.setRed = function setRed(r) {
        self.r = r;
    }

    this.setGreen = function setGreen(g) {
        self.g = g;
    }

    this.setBlue = function setBlue(b) {
        self.b = b;
    }

    /// Set the RGB values.
    this.setRgb = function setRgb(r, g, b) {
        self.r = r;
        self.g = g;
        self.b = b;
    }

    /// Set the colour from HSV values.
    /// H: HUE - between 0 and 359
    /// S: SATURATION - between 0 and 1
    /// V: VALUE - between 0 and 1
    this.fromHsv = function fromHsv(h, s, v) {
        if (h < 0 || s < 0 || v < 0 ||
            h >= 360 || s > 1 || v > 1) {
                return;
            }
        var hh = h / 60;
        var c = s * v;
        var x = c * (1 - Math.abs(hh % 2 - 1));
        var r1, g1, b1;

        if (hh < 1) {
            r1 = c * 255;
            g1 = x * 255;
            b1 = 0;
        } else if (hh < 2) {
            g1 = c * 255;
            r1 = x * 255;
            b1 = 0;
        } else if (hh < 3) {
            g1 = c * 255;
            b1 = x * 255;
            r1 = 0;
        } else if (hh < 4) {
            b1 = c * 255;
            g1 = x * 255;
            r1 = 0;
        } else if (hh < 5) {
            b1 = c * 255;
            r1 = x * 255;
            g1 = 0;
        } else {
            r1 = c * 255;
            b1 = x * 255;
            g1 = 0;
        }
        var m = v - c;
        self.r = r1 + m;
        self.g = g1 + m;
        self.b = b1 + m;
    }
}

(function () {
    var imageData, canvas, ctx;

    document.addEventListener('DOMContentLoaded', function () {
        canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');

        imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        var btn = document.getElementById("button-refresh");
        btn.onclick = function () {
			refresh();
		};
        refresh();
    });

    /// Refresh the mandelbrot image.
    var refresh = function() {
        var dx = 3 / canvas.width;
        var dy = 2 / canvas.height;

        for (var x = 0; x < canvas.width; x++) {
            for (var y = 0; y < canvas.height; y++) {
                var j = (dx * x) - 2;
                var k = (dy * y) - 1;
                var p = 0, q = 0;

                var colour = new Colour();
                var MAX_ITER = 100, iter = 0;

                while (p * p + q * q < 4 && iter < MAX_ITER) {
                    var t = p * p - q * q + j;
                    q = 2 * q * p + k;
                    p = t;
                    iter += 1;
                }
                if (iter < MAX_ITER)
                {
                    colour.fromHsv((360 / MAX_ITER) * iter, 1, 1);
                }
                setPixel(x, y, colour.red(), colour.green(), colour.blue());
            }
        }
        drawImage();
    };

    var setPixel = function(x, y, r, g, b) {
        var pixelSize = 4;
        var dataWidth = canvas.width * pixelSize;
        var i = x * pixelSize + y * dataWidth;

        imageData.data[i] = r;
        imageData.data[i + 1] = g;
        imageData.data[i + 2] = b;
        imageData.data[i + 3] = 255;
    };

    var drawImage = function() {
        ctx.putImageData(imageData, 0, 0);
    };

    var randomByte = function () {
        return Math.round(Math.random() * 255);
    }
})();