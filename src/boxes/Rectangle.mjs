/* eslint-disable no-dupe-class-members */
function isFloatEqual(a, b) {
    return Math.abs(a - b) <= 0.001;
}
export var AspectRatioMode;
(function (AspectRatioMode) {
    /// \brief Set the rectangle's width and height to match the target.
    AspectRatioMode[AspectRatioMode["IGNORE"] = 0] = "IGNORE";
    /// \brief Resizes the rectangle to completely fit within the target.
    AspectRatioMode[AspectRatioMode["KEEP"] = 1] = "KEEP";
    /// \brief Resizes the rectangle to completely enclose the target.
    AspectRatioMode[AspectRatioMode["KEEP_BY_EXPANDING"] = 2] = "KEEP_BY_EXPANDING";
    /// \breif Resizes the rectangle to completely fit within the target, but does not change enlarge the rectangle.
    AspectRatioMode[AspectRatioMode["KEEP_NO_ENLARGE"] = 3] = "KEEP_NO_ENLARGE";
})(AspectRatioMode || (AspectRatioMode = {}));
/// \brief Used to represent the available vertical rectangle alignment modes.
///
/// \sa ofRectangle
export var AlignVert;
(function (AlignVert) {
    /// \brief Do not perform any vertical alignment.
    AlignVert[AlignVert["IGNORE"] = 0] = "IGNORE";
    /// \brief Use the upper edge of the rectangle to vertically anchor the alignment.
    AlignVert[AlignVert["TOP"] = 16] = "TOP";
    /// \brief Use the bottom edge of the rectangle to vertically anchor the alignment.
    AlignVert[AlignVert["BOTTOM"] = 32] = "BOTTOM";
    /// \brief Use the center of the rectangle to vertically anchor the alignment.
    AlignVert[AlignVert["CENTER"] = 64] = "CENTER";
})(AlignVert || (AlignVert = {}));
/// \brief Used to represent the available horizontal rectangle alignment modes.
///
/// \sa ofRectangle
export var AlignHorz;
(function (AlignHorz) {
    /// \brief Do not perform any horizontal alignment.
    AlignHorz[AlignHorz["IGNORE"] = 0] = "IGNORE";
    /// \brief Use the left edge of the rectangle to horizontally anchor the alignment.
    AlignHorz[AlignHorz["LEFT"] = 1] = "LEFT";
    /// \brief Use the right edge of the rectangle to horizontally anchor the alignment.
    AlignHorz[AlignHorz["RIGHT"] = 2] = "RIGHT";
    /// \brief Use the center of the rectangle to horizontally anchor the alignment.
    AlignHorz[AlignHorz["CENTER"] = 4] = "CENTER";
})(AlignHorz || (AlignHorz = {}));
/// \brief Used to represent the available rectangle scaling modes.
///
/// ofScaleMode can usually be interpreted as a concise combination of
/// an ::ofAspectRatioMode, an ::ofAlignVert and an ::ofAlignHorz.
export var ScaleMode;
(function (ScaleMode) {
    /// \brief Center and scale the rectangle to fit inside the target.
    ///
    /// This centers the subject rectangle within the target rectangle and
    /// resizes the subject rectangle to completely fit within the target
    /// rectangle.
    ScaleMode[ScaleMode["FIT"] = 0] = "FIT";
    /// \brief Move and scale the rectangle to completely enclose the target.
    ///
    /// This centers the subject rectangle within the target rectangle and
    /// resizes the subject rectangle to completely encompass the target
    /// rectangle.
    ScaleMode[ScaleMode["FILL"] = 1] = "FILL";
    /// \brief Move the rectangle to be centered on the target.
    ///
    /// This centers the subject rectangle within the target rectangle and
    /// does not modify the Subject's size or aspect ratio.
    ScaleMode[ScaleMode["CENTER"] = 2] = "CENTER";
    /// \brief Match the target rectangle's position and dimensions.
    ScaleMode[ScaleMode["STRETCH_TO_FILL"] = 3] = "STRETCH_TO_FILL";
    ScaleMode[ScaleMode["FIT_NO_ENLARGE"] = 4] = "FIT_NO_ENLARGE";
})(ScaleMode || (ScaleMode = {}));
export default class Rectangle {
    x;
    y;
    width;
    height;
    constructor(x = 0, y = 0, width = 0, height = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    set(x, y, width, height) {
        if (x != null) {
            this.x = x;
        }
        if (y != null) {
            this.y = y;
        }
        if (width != null) {
            this.width = width;
        }
        if (height != null) {
            this.height = height;
        }
        return this;
    }
    setFromVec2(vec, width, height) {
        return this.set(vec.x, vec.y, width, height);
    }
    setFromRect(rect) {
        return this.set(rect.x, rect.y, rect.width, rect.height);
    }
    setFromCorners(topLeft, bottomRight) {
        let x0;
        let y0;
        let x1;
        let y1;
        x0 = Math.min(topLeft.x, bottomRight.x);
        x1 = Math.max(topLeft.x, bottomRight.x);
        y0 = Math.min(topLeft.y, bottomRight.y);
        y1 = Math.max(topLeft.y, bottomRight.y);
        const w = x1 - x0;
        const h = y1 - y0;
        return this.set(x0, y0, w, h);
    }
    get position() {
        return {
            x: this.x,
            y: this.y,
        };
    }
    set position(position) {
        this.x = position.x;
        this.y = position.y;
    }
    get size() {
        return {
            x: this.width,
            y: this.height,
        };
    }
    set size(vec) {
        this.width = vec.x;
        this.height = vec.y;
    }
    setFromCenter(x, y, w, h) {
        return this.set(x - w * 0.5, y - h * 0.5, w, h);
    }
    setFromCenterVec2(vec, w, h) {
        return this.setFromCenter(vec.x, vec.y, w, h);
    }
    translate(dx, dy) {
        return this.translateX(dx).translateY(dy);
    }
    translateVec2(vec) {
        return this.translate(vec.x, vec.y);
    }
    translateX(x) {
        this.x += x;
        return this;
    }
    translateY(y) {
        this.y += y;
        return this;
    }
    scale(scale) {
        return this.scaleXY(scale, scale);
    }
    scaleXY(x, y) {
        return this.scaleWidth(x).scaleHeight(y);
    }
    scaleVec2(vec) {
        return this.scaleXY(vec.x, vec.y);
    }
    scaleWidth(x) {
        this.width *= x;
        return this;
    }
    scaleHeight(y) {
        this.height *= y;
        return this;
    }
    scaleFromCenter(scale) {
        return this.scaleFromCenterXY(scale, scale);
    }
    scaleFromCenterXY(x, y) {
        if (isFloatEqual(x, 1.0) && isFloatEqual(y, 1.0)) {
            // Nothing to do
            return this;
        }
        const newWidth = this.width * x;
        const newHeight = this.height * y;
        const center = this.center;
        this.x = center.x - newWidth / 2;
        this.y = center.y - newHeight / 2;
        this.width = newWidth;
        this.height = newHeight;
        return this;
    }
    scaleFromCenterVec2(vec) {
        return this.scaleFromCenterXY(vec.x, vec.y);
    }
    scaleToAspect(targetRect, aspectRatioMode, ...args) {
        if (args.length === 0) {
            return this.scaleToAspect(targetRect, aspectRatioMode, AlignHorz.CENTER);
        }
        else if (args.length === 1) {
            return this.scaleToAspect(targetRect, aspectRatioMode, args[0], AlignVert.CENTER);
        }
        else if (args.length === 2) {
            return this.scaleToAspect(targetRect, aspectRatioMode, args[0], args[1], args[0], args[1]);
        }
        const [modelHorzAnchor, modelVertAnchor, thisHorzAnchor, thisVertAnchor,] = args;
        let tw = targetRect.width; // target width
        let th = targetRect.height; // target height
        let sw = this.width; // subject width
        let sh = this.height; // subject height
        if (aspectRatioMode === AspectRatioMode.KEEP_BY_EXPANDING ||
            aspectRatioMode === AspectRatioMode.KEEP ||
            aspectRatioMode === AspectRatioMode.KEEP_NO_ENLARGE) {
            if (aspectRatioMode !== AspectRatioMode.KEEP_NO_ENLARGE || (sw > tw || sh > th)) {
                if (Math.abs(sw) >= Number.EPSILON || Math.abs(sh) >= Number.EPSILON) {
                    let wRatio = Math.abs(tw) / Math.abs(sw);
                    let hRatio = Math.abs(th) / Math.abs(sh);
                    if (aspectRatioMode === AspectRatioMode.KEEP_BY_EXPANDING) {
                        this.scale(Math.max(wRatio, hRatio));
                    }
                    else if (aspectRatioMode === AspectRatioMode.KEEP || AspectRatioMode.KEEP_NO_ENLARGE) {
                        this.scale(Math.min(wRatio, hRatio));
                    }
                }
            }
        }
        else if (aspectRatioMode === AspectRatioMode.IGNORE) {
            this.width = tw;
            this.height = th;
        }
        else {
            this.width = tw;
            this.height = th;
        }
        // now align if anchors are not ignored.
        this.alignToRect(targetRect, modelHorzAnchor, modelVertAnchor, thisHorzAnchor, thisVertAnchor);
        return this;
    }
    scaleTo(targetRect, scaleMode = ScaleMode.FIT) {
        if (scaleMode === ScaleMode.FIT) {
            return this.scaleToAspect(targetRect, AspectRatioMode.KEEP, AlignHorz.CENTER, AlignVert.CENTER);
        }
        else if (scaleMode === ScaleMode.FIT_NO_ENLARGE) {
            return this.scaleToAspect(targetRect, AspectRatioMode.KEEP_NO_ENLARGE, AlignHorz.CENTER, AlignVert.CENTER);
        }
        else if (scaleMode === ScaleMode.FILL) {
            return this.scaleToAspect(targetRect, AspectRatioMode.KEEP_BY_EXPANDING, AlignHorz.CENTER, AlignVert.CENTER);
        }
        else if (scaleMode === ScaleMode.CENTER) {
            return this.alignToRect(targetRect, AlignHorz.CENTER, AlignVert.CENTER);
        }
        else if (scaleMode === ScaleMode.STRETCH_TO_FILL) {
            return this.scaleToAspect(targetRect, AspectRatioMode.IGNORE, AlignHorz.CENTER, AlignVert.CENTER);
        }
        else {
            return this.scaleToAspect(targetRect, AspectRatioMode.KEEP);
        }
    }
    alignToHorz(targetX, thisHorzAnchor = AlignHorz.CENTER) {
        if (thisHorzAnchor !== AlignHorz.IGNORE) {
            this.translateX(targetX - this.getHorzAnchor(thisHorzAnchor));
        }
        return this;
    }
    alignToHorzRect(targetRect, ...args) {
        if (args.length === 0) {
            return this.alignToHorzRect(targetRect, AlignHorz.CENTER);
        }
        else if (args.length === 1) {
            return this.alignToHorzRect(targetRect, args[0], args[0]);
        }
        const [targetHorzAnchor, thisHorzAnchor] = args;
        if (targetHorzAnchor !== AlignHorz.IGNORE &&
            thisHorzAnchor !== AlignHorz.IGNORE) {
            this.alignToHorz(targetRect.getHorzAnchor(targetHorzAnchor), thisHorzAnchor);
        }
        return this;
    }
    //----------------------------------------------------------
    alignToVert(targetY, thisVertAnchor = AlignVert.CENTER) {
        if (thisVertAnchor !== AlignVert.IGNORE) {
            this.translateY(targetY - this.getVertAnchor(thisVertAnchor));
        }
        return this;
    }
    //----------------------------------------------------------
    alignToVertRect(targetRect, ...args) {
        if (args.length === 0) {
            return this.alignToVertRect(targetRect, AlignVert.CENTER);
        }
        else if (args.length === 1) {
            return this.alignToVertRect(targetRect, args[0], args[0]);
        }
        const [targetVertAnchor, thisVertAnchor] = args;
        if (targetVertAnchor !== AlignVert.IGNORE &&
            thisVertAnchor !== AlignVert.IGNORE) {
            this.alignToVert(targetRect.getVertAnchor(targetVertAnchor), thisVertAnchor);
        }
        return this;
    }
    alignToVec2(targetPoint, thisHorzAnchor, thisVertAnchor) {
        this.alignToHorz(targetPoint.x, thisHorzAnchor);
        this.alignToVert(targetPoint.y, thisVertAnchor);
        return this;
    }
    alignToRect(targetRect, ...args) {
        if (args.length === 0) {
            return this.alignToRect(targetRect, AlignHorz.CENTER);
        }
        else if (args.length === 1) {
            return this.alignToRect(targetRect, args[0], AlignVert.CENTER);
        }
        else if (args.length === 2) {
            return this.alignToRect(targetRect, args[0], args[1], args[0], args[1]);
        }
        const [targetHorzAnchor, targetVertAnchor, thisHorzAnchor, thisVertAnchor,] = args;
        this.alignToHorzRect(targetRect, targetHorzAnchor, thisHorzAnchor);
        this.alignToVertRect(targetRect, targetVertAnchor, thisVertAnchor);
        return this;
    }
    insideXY(x, y) {
        return x > this.minX && y > this.minY && x < this.maxX && y < this.maxX;
    }
    insideVec2(vec) {
        return this.insideXY(vec.x, vec.y);
    }
    insideRect(rect) {
        return (this.insideXY(rect.minX, rect.minY) &&
            this.insideXY(rect.maxX, rect.maxY));
    }
    insideLine(vec1, vec2) {
        return this.insideVec2(vec1) && this.insideVec2(vec2);
    }
    growToIncludeXY(x, y) {
        const x0 = Math.min(this.minX, x);
        const x1 = Math.max(this.maxX, x);
        const y0 = Math.min(this.minY, y);
        const y1 = Math.max(this.maxY, y);
        const w = x1 - x0;
        const h = y1 - y0;
        this.set(x0, y0, w, h);
        return this;
    }
    growToIncludeVec2(vec) {
        return this.growToIncludeXY(vec.x, vec.y);
    }
    growToIncludeRect(rect) {
        const x0 = Math.min(this.minX, rect.minX);
        const x1 = Math.max(this.maxX, rect.maxX);
        const y0 = Math.min(this.minY, rect.minY);
        const y1 = Math.max(this.maxY, rect.maxY);
        const w = x1 - x0;
        const h = y1 - y0;
        this.set(x0, y0, w, h);
        return this;
    }
    growToIncludeLine(vec1, vec2) {
        this.growToIncludeVec2(vec1);
        this.growToIncludeVec2(vec2);
        return this;
    }
    getIntersectionRect(rect) {
        const x0 = Math.max(this.minX, rect.minX);
        const x1 = Math.min(this.maxX, rect.maxX);
        const w = x1 - x0;
        if (w < 0) {
            return new Rectangle();
        }
        const y0 = Math.max(this.minY, rect.minY);
        const y1 = Math.min(this.maxY, rect.maxY);
        const h = y1 - y0;
        if (h < 0) {
            return new Rectangle();
        }
        return new Rectangle(x0, y0, w, h);
    }
    getUnionRect(rect) {
        const united = new Rectangle(this.x, this.y, this.width, this.height);
        united.growToIncludeRect(rect);
        return united;
    }
    standardize() {
        if (this.width < 0) {
            this.x += this.width;
            this.width *= -1;
        }
        if (this.height < 0) {
            this.y += this.height;
            this.height *= -1;
        }
        return this;
    }
    get isStandardized() {
        return this.width >= 0 && this.height >= 0;
    }
    get area() {
        return Math.abs(this.width) * Math.abs(this.height);
    }
    get perimeter() {
        return 2 * Math.abs(this.width) + 2 * Math.abs(this.height);
    }
    get aspectRatio() {
        return Math.abs(this.width) / Math.abs(this.height);
    }
    get isEmpty() {
        return isFloatEqual(this.width, 0.0) && isFloatEqual(this.height, 0.0);
    }
    get min() {
        return {
            x: this.minX,
            y: this.minY,
        };
    }
    get max() {
        return {
            x: this.maxX,
            y: this.maxY,
        };
    }
    get minX() {
        return Math.min(this.x, this.x + this.width);
    }
    get maxX() {
        return Math.max(this.x, this.x + this.width);
    }
    get minY() {
        return Math.min(this.y, this.y + this.height);
    }
    get maxY() {
        return Math.max(this.y, this.y + this.height);
    }
    get left() {
        return this.minX;
    }
    get right() {
        return this.maxX;
    }
    get top() {
        return this.minY;
    }
    get bottom() {
        return this.maxY;
    }
    get topLeft() {
        return this.min;
    }
    get topRight() {
        return {
            x: this.right,
            y: this.top,
        };
    }
    get bottomLeft() {
        return {
            x: this.left,
            y: this.bottom,
        };
    }
    get bottomRight() {
        return this.max;
    }
    get center() {
        return {
            x: this.x + this.width * 0.5,
            y: this.y + this.height * 0.5,
        };
    }
    getHorzAnchor(anchor) {
        if (anchor === AlignHorz.LEFT) {
            return this.left;
        }
        else if (anchor === AlignHorz.RIGHT) {
            return this.right;
        }
        else if (anchor === AlignHorz.CENTER) {
            return this.center.x;
        }
        else {
            return 0;
        }
    }
    getVertAnchor(anchor) {
        if (anchor === AlignVert.TOP) {
            return this.top;
        }
        else if (anchor === AlignVert.BOTTOM) {
            return this.bottom;
        }
        else if (anchor === AlignVert.CENTER) {
            return this.center.y;
        }
        else {
            return 0;
        }
    }
    notEquals(rect) {
        return (this.x !== rect.x ||
            this.y !== rect.y ||
            this.width !== rect.width ||
            this.height !== rect.height);
    }
    equals(rect) {
        return (isFloatEqual(this.x, rect.x) &&
            isFloatEqual(this.y, rect.y) &&
            isFloatEqual(this.width, rect.width) &&
            isFloatEqual(this.height, rect.height));
    }
    addVec2(vec) {
        this.x += vec.x;
        this.y += vec.y;
        return this;
    }
    subVec2(vec) {
        this.x -= vec.x;
        this.y -= vec.y;
        return this;
    }
}
