import * as sheet from './../sheet';

describe('Sheet', () => {
    let s: sheet.Sheet;
    let header: string[] = ['id', 'name', 'releaes'];
    let body: sheet.CellType[][] = [
        [1, 'pokemon', 1995],
        [2, 'minecraft', 2011],
        [3, 'factorio', 2020]
    ];
    beforeEach(() => {
        s = new sheet.Sheet(header, body);
    });

    describe('#rowNum', () => {
        test('returns current row number', () => {
            expect(s.rowNum()).toBe(3);
        });
    });

    describe('#colNum', () => {
        test('returns current col number', () => {
            expect(s.colNum()).toBe(3);
        });
    });

    describe('#getBody', () => {
        describe('when empty body', () => {
            let body: string[][] = [];
            beforeEach(() => {
                s = new sheet.Sheet(header, body);
            });
            test('returns empty array', () => {
                expect(s.getBody().length).toBe(0);
            });
        });
        test('returns sheet.Row Object', () => {
            const row = s.getBody()[0]
            expect(row).toBeInstanceOf(sheet.Row);
            expect(row.cell(0).value).toBe(1);
            expect(row.cell(1).value).toBe('pokemon');
            expect(row.cell(2).value).toBe(1995);
        });
    });

    describe('#nextRow', () => {
        test('returns next Row Object', () => {
            const row = s.getBody()[0]
            const actual = s.nextRow(row)
            expect(actual).not.toBe(undefined)
            if (actual == undefined) { return } 

            expect(actual.cell(0).value).toBe(2)
        })

        test('returns last Row Object', () => {
            const row = s.getBody()[1]
            const actual = s.nextRow(row)
            expect(actual).not.toBe(undefined)
            if (actual == undefined) { return } 

            expect(actual.cell(0).value).toBe(3)
        })

        test('when inserted last row, it returns undefined', () => {
            const row = s.getBody()[2]
            const actual = s.nextRow(row)
            expect(actual).toBe(undefined)
        })
    });
});

describe('Row', () => {
    describe('#cellIndex', () => {
        let row: sheet.Row;
        let header: string[] = ['id', 'name', 'release'];
        let cells: sheet.CellType[] = [1, 'pokemon', 1995];
        beforeEach(() => {
            row = new sheet.Row(1, header, cells);
        });

        test('returns cell index', () => {
            expect(row.cellIndex(row.cell(0))).toBe(0);
            expect(row.cellIndex(row.cell(1))).toBe(1);
            expect(row.cellIndex(row.cell(2))).toBe(2);
        });
    });

    describe('#nextCell', () => {
        let row: sheet.Row;
        let header: string[] = ['id', 'name', 'release'];
        let cells: string[] = ['1', 'pokemon', '1995'];
        beforeEach(() => {
            row = new sheet.Row(1, header, cells);
        });

        test('returns right cell', () => {
            const arg = row.cell(0)
            const actual = row.nextCell(arg)
            expect(actual).not.toBe(undefined);
            if (actual == undefined) { return }

            expect(actual.key).toBe('name');
        });

        test('returns right cell', () => {
            const arg = row.cell(1)
            const actual = row.nextCell(arg)
            expect(actual).not.toBe(undefined);
            if (actual == undefined) { return }

            expect(actual.key).toBe('release');
        });

        test('when cell end, it returns null', () => {
            const arg = row.cell(2)
            const actual = row.nextCell(arg)
            expect(actual).toBe(undefined);
        });
    });
});