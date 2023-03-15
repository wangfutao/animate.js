/**
 * 矩阵
 */
export class Matrix {
    private  _matrix: number[][] = []

    constructor(arg1: number[][] | number, arg2?: number) {
        if (typeof arg1 == 'number') {
            //使用行数和列数来初始化矩阵，填充0
            if (!arg2){
                throw new Error('需传入矩阵的列数');
            }
            if (arg1 < 1 || arg2 < 1) {
                throw new Error('矩阵行列数不能小于1')
            }
            let matrix: number[][] = [];

            for (let i = 0; i < arg1; i++) {
                let row = [];
                for (let j = 0; j < arg2; j++) {
                    row.push(0);
                }
                matrix.push(row);
            }
            this._matrix = matrix;
        } else {
            //使用二维数组初始化矩阵
            this._matrix = arg1;
        }
    }

    get matrix(){
        return  this._matrix;
    }
    set matrix(mat: number[][]){
        this._matrix = mat;
    }

    get(row: number, col: number): number {
        return this._matrix[row][col];
    }

    set(row: number, col: number, value: number) {
        if (this._matrix && this._matrix[row]) {
            this._matrix[row][col] = value;
        }
    }

    getRow(row: number): number[] {
        return this._matrix[row];
    }

    getCol(col: number): number[] {
        let array: number[] = [];
        for (let i = 0; i < this.rowCount; i++) {
            array.push(this.get(i, col));
        }
        return array;
    }

    get rowCount(): number {
        return this._matrix.length;
    }

    get colCount(): number {
        if (!this._matrix[0]) {
            return 0;
        }
        return this._matrix[0].length;
    }

    /**
     * 复制当前矩阵
     */
    copy(){
        let rowCount = this.rowCount;
        let colCount = this.colCount;

        let matrix = new Matrix(rowCount, colCount);

        for (let row = 0; row < rowCount; row++){
            for (let col = 0; col < colCount; col++){
                matrix.set(row, col, this.get(row, col));
            }
        }
        return matrix;
    }

    /**
     * 矩阵相乘
     * @param mat
     */
    multiply(mat: Matrix) {
        let rowCount1 = this.rowCount;
        let colCount1 = this.colCount;

        let rowCount2 = mat.rowCount;
        let colCount2 = mat.colCount;

        if (colCount1 != rowCount2) {
            throw new Error('两个矩阵不能相乘，第一个矩阵的列数不等于第二个矩阵的行数');
        }

        let matrix = new Matrix(rowCount1, colCount2);

        for (let i = 0; i < rowCount1; i++) {
            for (let j = 0; j < colCount2; j++) {
                let row = this.getRow(i);
                let col = mat.getCol(j);
                let sum = 0;
                for (let k = 0; k < row.length; k++) {
                    sum += row[k] * col[k];
                }
                matrix.set(i, j, sum);
            }
        }
        return matrix;
    }
}
