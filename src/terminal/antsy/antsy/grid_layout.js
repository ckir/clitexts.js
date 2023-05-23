export class GridLayout {
    region;
    colConstraints;
    rowConstraints;
    lefts = [];
    tops = [];
    resizeListeners = new Set();
    onResize = () => this.resize(this.region.cols, this.region.rows);
    constructor(region, colConstraints, rowConstraints) {
        this.region = region;
        this.colConstraints = colConstraints;
        this.rowConstraints = rowConstraints;
        this.resize(region.cols, region.rows);
        region.onResize(this.onResize);
    }
    static fixed(cells) {
        return { minimum: cells, factor: 0 };
    }
    static stretch(factor) {
        return { minimum: 0, factor };
    }
    static stretchWithMinimum(factor, minimum) {
        return { minimum, factor };
    }
    static stretchWithMinMax(factor, minimum, maximum) {
        return { minimum, maximum, factor };
    }
    detach() {
        this.region.removeOnResize(this.onResize);
    }
    update(colConstraints, rowConstraints) {
        this.colConstraints = colConstraints;
        this.rowConstraints = rowConstraints;
        this.resize(this.region.cols, this.region.rows);
    }
    adjustCol(x, c) {
        this.colConstraints[x] = c;
        this.update(this.colConstraints, this.rowConstraints);
    }
    adjustRow(y, c) {
        this.rowConstraints[y] = c;
        this.update(this.colConstraints, this.rowConstraints);
    }
    layout(x1, y1, x2, y2) {
        const r = this.region.clip(this.lefts[x1], this.tops[y1], this.lefts[x2], this.tops[y2]);
        this.resizeListeners.add(() => {
            r.resize(this.lefts[x1], this.tops[y1], this.lefts[x2], this.tops[y2]);
        });
        return r;
    }
    layoutAt(x1, y1) {
        return this.layout(x1, y1, x1 + 1, y1 + 1);
    }
    resize(cols, rows) {
        const widths = calculateSizes(this.colConstraints, cols);
        const heights = calculateSizes(this.rowConstraints, rows);
        let left = 0, top = 0;
        this.lefts = widths.map(w => {
            left += w;
            return left - w;
        });
        this.lefts.push(left);
        this.tops = heights.map(h => {
            top += h;
            return top - h;
        });
        this.tops.push(top);
        for (const f of [...this.resizeListeners])
            f();
    }
    static solveConstraints(constraints, size) {
        return calculateSizes(constraints, size);
    }
}
function sum(list) {
    return list.reduce((sum, n) => sum + n, 0);
}
function calculateSizes(constraints, size) {
    // divide up the space by weight, but if any element doesn't make its
    // minimum, give it a fixed size and don't count it among the weights.
    const results = constraints.map(constraint => ({ constraint, possibleSize: 0 }));
    let remaining = size;
    let solved = false;
    while (!solved) {
        solved = true;
        // only unplaced elements contribute to weight
        const weight = sum(results.filter(r => r.size === undefined).map(r => r.constraint.factor));
        for (const r of results) {
            if (r.size !== undefined)
                continue;
            r.possibleSize = weight == 0 ? 0 : Math.floor(remaining * r.constraint.factor / weight);
            if (r.possibleSize < r.constraint.minimum) {
                // weighted distribution didn't give this element its minimum size.
                // pin it to the minimum size, remove it from the available space,
                // remove it from the pool of weighted elements, and do another round.
                r.size = Math.min(r.constraint.minimum, remaining);
                remaining -= r.size;
                solved = false;
            }
            else if (r.constraint.maximum !== undefined && r.possibleSize > r.constraint.maximum) {
                // element doesn't want that much space. pin it and continue.
                r.size = r.constraint.maximum;
                remaining -= r.size;
                solved = false;
            }
        }
    }
    // the truncation above may result in unused space. allocate it round-robin
    // to the stretch constraints until it's used up.
    let total = sum(results.map(r => r.size ?? r.possibleSize));
    for (let i = 0; total < size && i < results.length; i++) {
        if (results[i].constraint.factor > 0 && results[i].size === undefined) {
            results[i].possibleSize++;
            total++;
        }
    }
    return results.map(r => r.size ?? r.possibleSize);
}
//# sourceMappingURL=grid_layout.js.map