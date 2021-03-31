import { assert } from 'node:console';
import * as t from '../model/table';

describe('TableUI', () => {
  const header = (): string[] => {
      return ['id', 'name', 'release']
  }
  const body = (): t.CellType[][] => {
    return [
      [1, 'pokemon', 1995],
      [2, 'minecraft', 2011],
      [3, 'factorio', 2020]
    ]
  }

  describe('#cells', () => {
    test('returns table', () => {
      const tbl = new t.TableUI(header(), body());
      expect(tbl.cells()[0][0].data.value).toBe(0);
      expect(tbl.cells()[0][1].data.value).toBe('id');
      expect(tbl.cells()[0][2].data.value).toBe('name');
      expect(tbl.cells()[0][3].data.value).toBe('release');
      expect(tbl.cells()[1][0].data.value).toBe(1);
      expect(tbl.cells()[1][1].data.value).toBe(1);
      expect(tbl.cells()[1][2].data.value).toBe('pokemon');
      expect(tbl.cells()[1][3].data.value).toBe(1995);
      expect(tbl.cells()[2][0].data.value).toBe(2);
      expect(tbl.cells()[2][1].data.value).toBe(2);
      expect(tbl.cells()[2][2].data.value).toBe('minecraft');
      expect(tbl.cells()[2][3].data.value).toBe(2011);
      expect(tbl.cells()[3][0].data.value).toBe(3);
      expect(tbl.cells()[3][1].data.value).toBe(3);
      expect(tbl.cells()[3][2].data.value).toBe('factorio');
      expect(tbl.cells()[3][3].data.value).toBe(2020);
    });
  });

  describe ('x', () => {
    let tbl: t.TableUI;
    beforeEach(() => {
      tbl = new t.TableUI(header(), body());
    })

    describe('default', () => {
      test('1st row', () => expect(tbl.x(0)).toBe(0))
      test('2nd row', () => expect(tbl.x(1)).toBe(151))
      test('3rd row', () => expect(tbl.x(2)).toBe(302))
    });

    describe('when cell size customized', () => {
      beforeEach(() => {
        tbl = new t.TableUI(header(), body());
        tbl.setRowSize(0, 1)
        tbl.setRowSize(1, 10)
        tbl.setRowSize(2, 100)
      })
      test('1st row', () => expect(tbl.x(0)).toBe(0))
      test('2nd row', () => expect(tbl.x(1)).toBe(2)) 
      test('3rd row', () => expect(tbl.x(2)).toBe(13))
      test('4th row', () => expect(tbl.x(3)).toBe(114))

    });
  });

  describe('y', () => {
    let tbl: t.TableUI;
    beforeEach(() => {
      tbl = new t.TableUI(header(), body())
    })

    describe('default', () => {
      test('1st row', () => expect(tbl.y(0)).toBe(0))
      test('2nd row', () => expect(tbl.y(1)).toBe(33))
      test('3rd row', () => expect(tbl.y(2)).toBe(64))
    });

    describe('when cell size customized', () => {
      beforeEach(() => {
        tbl = new t.TableUI(header(), body());
        tbl.setColSize(0, 1)
        tbl.setColSize(1, 10)
        tbl.setColSize(2, 100)
      })
      test('1st row', () => expect(tbl.y(0)).toBe(0))
      test('2nd row', () => expect(tbl.y(1)).toBe(4)) 
      test('3rd row', () => expect(tbl.y(2)).toBe(15))
      test('4th row', () => expect(tbl.y(3)).toBe(116))

    });
  })
});

describe('Table', () => {
  const header = (): string[] => {
      return ['id', 'name', 'release']
  }
  const body = (): t.CellType[][] => {
    return [
      [1, 'pokemon', 1995],
      [2, 'minecraft', 2011],
      [3, 'factorio', 2020]
    ]
  }

  describe('#rowSize', () => {
    test('returns current row number', () => {
      const tbl = new t.Table(header(), body());
      expect(tbl.rowSize()).toBe(3);
    });
  });

  describe('#columnSize', () => {
    test('returns current row number', () => {
      const tbl = new t.Table(header(), body());
      expect(tbl.columnSize()).toBe(3);
    });
  });

  describe('insertRow', () => {
    test('inserts top row', () => {
      const tbl = new t.Table(header(), body());
      let row: t.CellType[] = ['a', 'b', 'c']
      tbl.insertRow(0, row)
      expect(tbl.cell(0, 0).value).toBe('a')
      expect(tbl.cell(0, 1).value).toBe(1)
      expect(tbl.cell(0, 2).value).toBe(2)
      expect(tbl.cell(0, 3).value).toBe(3)
    })

    test('inserts last row', () => {
      const tbl = new t.Table(header(), body());
      let row: t.CellType[] = ['a', 'b', 'c']
      tbl.insertRow(3, row)
      expect(tbl.cell(0, 0).value).toBe(1)
      expect(tbl.cell(0, 1).value).toBe(2)
      expect(tbl.cell(0, 2).value).toBe(3)
      expect(tbl.cell(0, 3).value).toBe('a')
    })

    test('inserts after last row', () => {
      const tbl = new t.Table(header(), body());
      let row: t.CellType[] = ['a', 'b', 'c']
      expect(() => tbl.insertRow(100, row)).toThrow()
    })
  })

  describe('insertColumn', () => {
    test('inserts top row', () => {
      const tbl = new t.Table(header(), body());
      let row: t.CellType[] = ['a', 'b', 'c']
      tbl.insertColumn(0, 'hoge', row)
      expect(tbl.cell(0, 0).value).toBe('a')
      expect(tbl.cell(1, 0).value).toBe(1)
      expect(tbl.cell(2, 0).value).toBe('pokemon')
      expect(tbl.cell(3, 0).value).toBe(1995)
    })

    test('inserts last row', () => {
      const tbl = new t.Table(header(), body());
      let row: t.CellType[] = ['a', 'b', 'c']
      tbl.insertColumn(3, 'hoge', row)
      expect(tbl.cell(0, 0).value).toBe(1)
      expect(tbl.cell(1, 0).value).toBe('pokemon')
      expect(tbl.cell(2, 0).value).toBe(1995)
      expect(tbl.cell(3, 0).value).toBe('a')
    })

    test('inserts after last row', () => {
      const tbl = new t.Table(header(), body());
      let row: t.CellType[] = ['a', 'b', 'c']
      expect(() => tbl.insertColumn(100, 'hoge', row)).toThrow()
    })
  })
});
