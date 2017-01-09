import * as React from "react";
import remoteApi from '../api/RemoteApi'
import {RemoteConstant} from "../api/RemoteConstant";
import ReactNode = React.ReactNode;
import Function1 = _.Function1;

interface IDataState {
  header?: Array<String>,
  data?: Array<Array<String>>
  pageCriteria?: IPageCriteria
  fullData?: Array<Array<String>>
}


interface IPageCriteria {
  page?: Number
  size?: Number
  sortColumn?: String
  sortOrder?: String
  filter?: String
  totalPage?: Number
}

interface IPagination {
  current: Number
  length: Number
  end?: Number
  onPageChange?: any
}

interface ISearch {
  text: String
  onTextChange: any
}

const Header: React.StatelessComponent<IDataState> = (heading) => (
  <thead>
  <tr>
    {heading.header.map((v, i) => (<td key={i}>{v}</td>))}
  </tr>
  </thead>
)

const Details: React.StatelessComponent<IDataState> = (details) => (
  <tbody>
  {details.data.map((row, i) => (
    <tr key={i}>
      {row.map((col, i) => (
        <td key={i}>{col}</td>
      ))}
    </tr>
  ))}
  </tbody>
)

const DataTables: React.StatelessComponent<IDataState> = (details) => (
  <div className="row">
    <div className="col-md-12">
      <table
        className="table table-responsive table-striped table-bordered table-condensed table-hover lessMarginBottom">
        <Header header={details.header}/>
        <Details data={details.data}/>
      </table>
    </div>

  </div>
)

const Search: React.StatelessComponent<ISearch> = (search) => (
  <div className="row addMarginTop">
    <div className="col-md-4">
      <h1 className="lessMarginTopBottom">CRS Search</h1>
    </div>
    <div className="textAlignRight col-md-8 lessMarginTopBottom">
      <input type="text" className="form-control input-lg" placeholder=" Search for Account / Party / Country ..."
             value={search.text.toString()}
             onChange={(e) => search.onTextChange(e.currentTarget.value)}/>

    </div>
  </div>
)

const PagingLabel: React.StatelessComponent<IPagination> = (page) => (
  <span className="label">Page {page.current} of {page.end}</span>
)


const Pagination: React.StatelessComponent<IPagination> = paging => {
  let pageDisplayArray: Array<String> = []
  let pageFunctionArray: Array<String> = []
  const midPage = Math.floor(paging.length.valueOf() / 2)
  let start = paging.current.valueOf() - midPage
  const diffEnd = paging.end.valueOf() - paging.current.valueOf()
  start = start < 1 ? 1 : start + (diffEnd <= midPage ? diffEnd - 1 : 0 )

  for (let i = 0; i < paging.length; i++) {
    (paging.current == i + start) ? pageFunctionArray.push("active") :
      ( paging.end < i + start ? pageFunctionArray.push("disabled") : pageFunctionArray.push("") )
    pageDisplayArray.push(String(i + start))
  }

  return (
    <div className="row">
      <div className="col-md-2 col-sm-2 col-xs-2">
        <PagingLabel current={paging.current} end={paging.end} length={paging.length}/>
      </div>
      <div className="col-md-4 col-md-offset-6 col-sm-6 col-sm-offset-4 col-xs-8 col-xs-offset-2 textAlignRight">
        <ul className="pagination lessMarginTopBottom">
          <li className={paging.current==1?'disabled':''}
              onClick={() => paging.onPageChange(paging.current.valueOf() - Number(1))}>
            <a href="#" aria-label="Previous">
              <span aria-hidden="true">{String.fromCharCode(171)}</span>
            </a>
          </li>
          {
            pageDisplayArray.map((value, key) => (
              <li key={key} className={pageFunctionArray[key].valueOf()}
                  onClick={() => {paging.onPageChange(value)}}>
                <a href="#">{value}</a>
              </li>
            ))
          }
          <li className={paging.current == paging.end ?'disabled':''}
              onClick={() => paging.onPageChange(paging.current.valueOf()+1)}>
            <a href="#" aria-label="Next">
              <span aria-hidden="true">{String.fromCharCode(187)}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}


export default class DataGrid extends React.Component<any, IDataState> {

  constructor(props: any) {
    super(props)
    const pageCriteria: IPageCriteria = {page: 0, size: 10, totalPage: 0, filter: ''}
    this.state = {header: [], data: [], pageCriteria: pageCriteria, fullData:[]}

  }

  applyFilterCriteria(pageCriteria: IPageCriteria, fullData: Array<Array<String>>): Array<Array<String>> {
    const filter = pageCriteria.filter.trim().toString();
    let returnData = fullData;
    if (filter.length > 0) {
      returnData = fullData.filter(
        (values, i) => values.filter(
          (data: string) => {
            let columnData = data + ""
            return columnData.indexOf(filter) >= 0
          }
        ).length > 0
      )
    }
    return returnData;
  }

  applyPagingCriteria(pageCriteria: IPageCriteria, fullData: Array<Array<String>>): Array<Array<String>> {
    let end = pageCriteria.page.valueOf() * pageCriteria.size.valueOf()
    let start = end - pageCriteria.size.valueOf()
    return fullData.slice(start, end)
  }

  onPageChange(pageNo: Number) {
    const pageCriteria: IPageCriteria = this.state.pageCriteria
    if (pageNo >= 1 && pageNo <= pageCriteria.totalPage && pageNo != pageCriteria.page) {
      this.getData({page: Number(pageNo)})
    }
  }

  onSearchTextChange(text: String) {
    const pageCriteria: IPageCriteria = this.state.pageCriteria
    if (text != pageCriteria.filter) {
      this.getData({filter: text, page: Number(1)})
    }
  }

  getHeader() {
    remoteApi.getData(RemoteConstant.CRSHeader).then(
      res => {
        this.setState({header: res.data as Array<String>})
      }
    )
  }

  extractFullData(newPageCriteria: Object) {
    remoteApi.getData(RemoteConstant.CRSData).then(
      res => {
        let fullData = res.data as Array<Array<String>>;
        this.getData(newPageCriteria, fullData);
      }
    )
  }

  getData(newPageCriteria: Object, initialData : Array<Array<String>> = []) {
    const pageCriteria: IPageCriteria = (Object as any).assign({},
      this.state.pageCriteria, newPageCriteria)
    let fullData = initialData
    if ( initialData.length == 0) {
      fullData = this.state.fullData
    }
    let filterData = this.applyFilterCriteria(pageCriteria, fullData)
    pageCriteria.totalPage = Math.ceil(filterData.length / pageCriteria.size.valueOf())
    const data = this.applyPagingCriteria(pageCriteria,filterData )
    if ( initialData.length == 0 ) {
      this.setState({data, pageCriteria})
    } else {
      this.setState({data, pageCriteria, fullData})
    }
  }

  componentWillMount() {
    this.getHeader()
    this.extractFullData({page: 1})
  }

  render() {
    return (
      <div>
        <div className="container">
          <Search text={this.state.pageCriteria.filter.toString()}
                  onTextChange={(text:String) => this.onSearchTextChange(text)}/>
          <DataTables header={this.state.header} data={this.state.data}/>

          <Pagination
            current={this.state.pageCriteria.page}
            length={3}
            end={this.state.pageCriteria.totalPage}
            onPageChange={(pageNo:Number) => this.onPageChange(pageNo) }/>
        </div>
      </div>
    );
  }
}


