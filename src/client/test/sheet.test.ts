import { assert } from 'node:console';
import * as sheet from './../sheet';

describe('Sheet', () => {
    const header = (): string[] => {
        return ['id', 'name', 'release']
    }
    const body = (): sheet.CellType[][] => {
        return [
            [1, 'pokemon', 1995],
            [2, 'minecraft', 2011],
            [3, 'factorio', 2020]
        ]
    }
    describe('#new', () => {
        test('create cell', () => {
            const s = new sheet.Sheet(header(), body());
            expect(s.cells[0][0].value).toBe('id')
            expect(s.cells[0][0].x).toBe(1)
            expect(s.cells[0][0].y).toBe(1)
            expect(s.cells[0][0].rowIndex).toBe(0)
            expect(s.cells[0][0].colIndex).toBe(0)
            expect(s.cells[0][1].value).toBe('name')
            expect(s.cells[0][1].x).toBe(152)
            expect(s.cells[0][1].y).toBe(1)
            expect(s.cells[0][1].rowIndex).toBe(0)
            expect(s.cells[0][1].colIndex).toBe(1)
            expect(s.cells[0][2].value).toBe('release')
            expect(s.cells[0][2].x).toBe(303)
            expect(s.cells[0][2].y).toBe(1)
            expect(s.cells[0][2].rowIndex).toBe(0)
            expect(s.cells[0][2].colIndex).toBe(2)

            expect(s.cells[1][0].value).toBe(1)
            expect(s.cells[1][0].x).toBe(1)
            expect(s.cells[1][0].y).toBe(32)
            expect(s.cells[1][0].rowIndex).toBe(1)
            expect(s.cells[1][0].colIndex).toBe(0)
            expect(s.cells[1][1].value).toBe('pokemon')
            expect(s.cells[1][1].x).toBe(152)
            expect(s.cells[1][1].y).toBe(32)
            expect(s.cells[1][1].rowIndex).toBe(1)
            expect(s.cells[1][1].colIndex).toBe(1)
            expect(s.cells[1][2].value).toBe(1995)
            expect(s.cells[1][2].x).toBe(303)
            expect(s.cells[1][2].y).toBe(32)
            expect(s.cells[1][2].rowIndex).toBe(1)
            expect(s.cells[1][2].colIndex).toBe(2)

            expect(s.cells[2][0].value).toBe(2)
            expect(s.cells[2][0].x).toBe(1)
            expect(s.cells[2][0].y).toBe(63)
            expect(s.cells[2][0].rowIndex).toBe(2)
            expect(s.cells[2][0].colIndex).toBe(0)
            expect(s.cells[2][1].value).toBe('minecraft')
            expect(s.cells[2][1].x).toBe(152)
            expect(s.cells[2][1].y).toBe(63)
            expect(s.cells[2][1].rowIndex).toBe(2)
            expect(s.cells[2][1].colIndex).toBe(1)
            expect(s.cells[2][2].value).toBe(2011)
            expect(s.cells[2][2].x).toBe(303)
            expect(s.cells[2][2].y).toBe(63)
            expect(s.cells[2][2].rowIndex).toBe(2)
            expect(s.cells[2][2].colIndex).toBe(2)

            expect(s.cells[3][0].value).toBe(3)
            expect(s.cells[3][0].x).toBe(1)
            expect(s.cells[3][0].y).toBe(94)
            expect(s.cells[3][0].rowIndex).toBe(3)
            expect(s.cells[3][0].colIndex).toBe(0)
            expect(s.cells[3][1].value).toBe('factorio')
            expect(s.cells[3][1].x).toBe(152)
            expect(s.cells[3][1].y).toBe(94)
            expect(s.cells[3][0].rowIndex).toBe(3)
            expect(s.cells[3][1].colIndex).toBe(1)
            expect(s.cells[3][2].value).toBe(2020)
            expect(s.cells[3][2].x).toBe(303)
            expect(s.cells[3][2].y).toBe(94)
            expect(s.cells[3][2].rowIndex).toBe(3)
            expect(s.cells[3][2].colIndex).toBe(2)
        });
    });

    describe('#rowNum', () => {
        test('returns current row number', () => {
            const s = new sheet.Sheet(header(), body());
            expect(s.rowNum()).toBe(4);
        });
    });

    describe('#colNum', () => {
        test('returns current col number', () => {
            const s = new sheet.Sheet(header(), body());
            expect(s.colNum()).toBe(3);
        });
    });

    describe('#row', () => {
        test('returns row', () => {
            const s = new sheet.Sheet(header(), body());
            expect(s.row(0).cells[0].value).toBe('id');
            expect(s.row(0).cells[1].value).toBe('name');
            expect(s.row(0).cells[2].value).toBe('release');

            expect(s.row(1).cells[0].value).toBe(1);
            expect(s.row(1).cells[1].value).toBe('pokemon');
            expect(s.row(1).cells[2].value).toBe(1995);

            expect(s.row(2).cells[0].value).toBe(2);
            expect(s.row(2).cells[1].value).toBe('minecraft');
            expect(s.row(2).cells[2].value).toBe(2011);

            expect(s.row(3).cells[0].value).toBe(3);
            expect(s.row(3).cells[1].value).toBe('factorio');
            expect(s.row(3).cells[2].value).toBe(2020);
        });
    })

    describe('#column', () => {
        test('returns column', () => {
            const s = new sheet.Sheet(header(), body());
            expect(s.column(0).cells[0].value).toBe('id');
            expect(s.column(0).cells[1].value).toBe(1);
            expect(s.column(0).cells[2].value).toBe(2);
            expect(s.column(0).cells[3].value).toBe(3);

            expect(s.column(1).cells[0].value).toBe('name');
            expect(s.column(1).cells[1].value).toBe('pokemon');
            expect(s.column(1).cells[2].value).toBe('minecraft');
            expect(s.column(1).cells[3].value).toBe('factorio');

            expect(s.column(2).cells[0].value).toBe('release');
            expect(s.column(2).cells[1].value).toBe(1995);
            expect(s.column(2).cells[2].value).toBe(2011);
            expect(s.column(2).cells[3].value).toBe(2020);
        });
    })

    describe('insertRow', () => {
        test('inserts top row', () => {
            const s = new sheet.Sheet(header(), body());
            let row: sheet.CellType[] = ['a', 'b', 'c']
            s.insertRow(0, row)
            expect(s.row(1).cells[0].value).toBe('a')
        })

        test('inserts after first row', () => {
            const s = new sheet.Sheet(header(), body());
            let row: sheet.CellType[] = ['a', 'b', 'c']
            s.insertRow(2, row)
            expect(s.row(3).cells[0].value).toBe('a')
        })

        test('inserts after last row', () => {
            const s = new sheet.Sheet(header(), body());
            let row: sheet.CellType[] = ['a', 'b', 'c']
            expect(() => s.insertRow(100, row)).toThrow()
        })
    })

    describe('insertCol', () => {
        test('inserts first column', () => {
            const s = new sheet.Sheet(header(), body());
            let col: sheet.CellType[] = ['a', 'b', 'c']
            s.insertCol(0, 'alphabet', col)
            expect(s.column(0).cells[0].value).toBe('alphabet')
        })

        test('inserts second column', () => {
            const s = new sheet.Sheet(header(), body());
            let col: sheet.CellType[] = ['a', 'b', 'c']
            s.insertCol(1, 'alphabet', col)
            expect(s.column(0).cells[0].value).toBe('id')
            expect(s.column(1).cells[0].value).toBe('alphabet')
        })

        test('inserts after last column', () => {
            const s = new sheet.Sheet(header(), body());
            let col: sheet.CellType[] = ['a', 'b', 'c']
            expect(() => s.insertCol(100, 'alphabet', col)).toThrow()
        })
    })
});
