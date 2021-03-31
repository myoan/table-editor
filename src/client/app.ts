import * as sheet from './model/sheet'
import * as lemur from './lib/framework'

import {TableModel} from './model/table'
import {TablePresenter} from './presenter/table'
import {TableView} from './view/table'

const main = () => {
  console.log('rendering')

  const header: string[] = ['id', 'name', 'age']
  const body: sheet.CellType[][] = [
    [1, 'hoge', 12],
    [2, "fuga\nfuga", 22],
    [3, '日本語', 32]
  ]

  let model = new TableModel(header, body)
  let view = new TableView() 
  let presenter = new TablePresenter(model, view)
  model.addObserver(presenter as lemur.Observer)
  view.addObserver(presenter as lemur.Observer)

  // TODO: データを読み直してpresenterに通知
  // model.refresh()
}

main()