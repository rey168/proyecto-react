var fruitsJson = [
  {fruitName: 'Apple', color: 'green', checked:false},
  {fruitName: 'Orange',color: 'yellow', checked:false},
  {fruitName: 'grape', color:'purple',  checked: false},
  {fruitName: 'banana', color:'yellow', checked: false},
  {fruitName: 'pear', color:'yellow', checked: false}
];

var MainWrapper = React.createClass({
  getInitialState: function(){
    return {
      data:[],
      editData: [{fruitName:'',color:''}]
    }
  },
  handleSearch: function(queryString){
    /*Seach is based on the all data source*/
    var fruitInfo = this.props.data;
    var result = [];
    fruitInfo.map(function(fruit){
      if (fruit.fruitName === queryString || fruit.color === queryString){
        result.push(fruit);
      }
    });

    this.setState({data:result});
  },
  handleEdit: function(fruit){
    var fruitInfo = this.state.data;
    var newItem = {};
    if (fruit.action === 'add'){
      newItem.fruitName = fruit.fruitName;
      newItem.color = fruit.color;
      newItem.checked = false;
      fruitInfo.push(newItem);
    }else{
      fruitInfo[fruit.index].fruitName = fruit.fruitName;
      fruitInfo[fruit.index].color = fruit.color;
      fruitInfo[fruit.index].checked = false;
    }
    this.setState({data:fruitInfo, editData:[{fruitName:'',color:''}]});
    var popUpBox = document.querySelector('.popUp');
    popUpBox.classList.remove('open');

  },
  handleDel: function(){
    //var allActiveEle = document.querySelectorAll('.active');
    var fruitInfo = this.state.data;
    var removeEles = [];

    for(var index = fruitInfo.length - 1; index >= 0; index--){
      if (fruitInfo[index].checked === true){
        removeEles.push(index);
      }
    }


    if (removeEles.length == 0){
      console.log('Nothing to delete');
    }else{
      removeEles.map(function(index){
        fruitInfo.splice(index, 1);
      })
    }

    this.setState({data:fruitInfo});
  },
  handleEdited: function(){
    var fruitInfo = this.state.data;
    var editEles = [];

    fruitInfo.map(function(fruit,index){
      if (fruit.checked === true){
        fruit.index = index;
        editEles.push(fruit);
      }
    })

    if (editEles.length == 0){
      alert('Nothing to be selected.');
      return;
    }else if(editEles.length > 1){
      alert('only support to edit one item in one time');
      return;
    }else{  
      var popUpBox = document.querySelector('.popUp');
      popUpBox.classList.add('open');
      this.setState({editData: editEles});
    }
  },
  handleClose: function(){
    this.setState({editData: [{fruitName:'',color:''}]});
  },
  handleChecked: function(fruitObj){
    var fruitInfo = this.state.data;
    fruitInfo[fruitObj.index].checked = fruitObj.isChecked;

    this.setState({data:fruitInfo});

  },
  handleAllChecked: function(isChecked){
    var fruitInfo = this.state.data;

    fruitInfo.map(function(fruit){
      fruit.checked = isChecked;
    })

    this.setState({data:fruitInfo});
  },
  componentDidMount: function(){
    this.setState({data:this.props.data});
  },
  render: function(){
    return (
      <div className='mainWrapper'>
        <TableAction  handleSearch = {this.handleSearch} handleDel = {this.handleDel} handleEdited={this.handleEdited}/>
        <TableBox tableHead = {this.props.head}
                  data = {this.state.data}
                  handleChecked = {this.handleChecked}
                  handleAllChecked = {this.handleAllChecked}
        />
        <PopUpBox handleEdit={this.handleEdit} handleClose={this.handleClose} data={this.state.editData}/>
      </div>
    )
  }
});

var PopUpBox = React.createClass({
  getInitialState: function (){
    return {
      name:'',
      color: ''
    }
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var name = this.refs.name.value.trim();
    var color = this.refs.color.value.trim();
    if (!name || !color) {
      return;
    }
    var editItem = {
      fruitName: name,
      color: color,
    };
    /*This is a add action*/
    if (this.props.data[0].checked == undefined){
      editItem.action = 'add';
    }else{ /*This is a edit action*/
      editItem.action = 'edit';
      editItem.index = this.props.data[0].index;
    }

    this.props.handleEdit(editItem);

    this.refs.name.value = '';
    this.refs.color.value = '';
    return;
  },
  handleClose: function(e){
  
    e.preventDefault();

    var popUpBox = document.querySelector('.popUp');
    popUpBox.classList.remove('open');
    this.props.handleClose();
    return;
  },
  componentDidMount: function(){
    this.setState({
      name: this.props.data[0].fruitName,
      color: this.props.data[0].color
    })
  },
  componentWillReceiveProps: function(nextProps) {

    this.setState({
      name: nextProps.data[0].fruitName,
      color: nextProps.data[0].color
    });
  },

  handleNameChange: function(e){
    this.setState({name: e.target.value});
  },
  handleColorChange: function(e){
    this.setState({color: e.target.value});
  },
  render: function(){

    return (
      <div className='popUp'>
        <form className='formControl' onSubmit={this.handleSubmit}>
          <label htmlFor ='name'>Fruit Name</label>
          <input type='text' ref='name' name='name' value={this.state.name} onChange={this.handleNameChange}/>
          <br />
          <label htmlFor ='color'>Fruit Color</label>
          <input type='text' ref='color' name='color' value={this.state.color} onChange={this.handleColorChange}/>
          <br />
          <input type='submit' value='Submit' className='btn btn-success submit'/>
        </form>
        <button type='button' className='close' data-dismiss='alert' aria-label='Close' onClick={this.handleClose}>
          <span aria-hidden='true'>&times;</span>
        </button>
      </div>
    )
  }
});
var TableAction = React.createClass({
  render: function(){
    return (
      <div className='tableAction'>
        <TableAdd />
        <TableEdit  onEditSubmit={this.props.handleEdited}/>
        <TableDelete onDeleteSubmit = {this.props.handleDel}/>
        <TableSearch onSearchSubmit={this.props.handleSearch} />
      </div>
    )
  }
});

var TableSearch = React.createClass({
  handleSubmit: function(e){
    e.preventDefault();
    var queryString = this.refs.queryString.value.trim();

    if(!queryString){
      return;
    }
    this.props.onSearchSubmit(queryString);

    this.refs.queryString.value = '';

    return;
  },

  render: function(){
    return (
      <div className='pull-right search'>
        <input type='text' placeholder='Search' ref='queryString' />

        <button id='searchSubmit' className='btn btn-default btn-sm' onClick={this.handleSubmit}>Search</button>
      </div>
    )
  }
})

var TableAdd  = React.createClass({
  handleSubmit: function(e){
    e.preventDefault();

    var popUpBox = document.querySelector('.popUp');
    popUpBox.classList.add('open');

    return;
  },

  render: function(){
    return (
      <button className='btn btn-success' onClick={this.handleSubmit}>Add</button>
    )
  }
});

var TableEdit  = React.createClass({

  handleSubmit: function(e){
    e.preventDefault();

    this.props.onEditSubmit();
    return;
  },
  render: function(){
    return (
      <button className='btn btn-warning' onClick={this.handleSubmit} >Edit</button>
    )
  }
});
var TableDelete  = React.createClass({

  render: function(){
    return (
      <button className='btn btn-danger' onClick = {this.props.onDeleteSubmit}>Delete</button>
    )
  }
});




var TableBox = React.createClass({
  propTypes: {
    tableHead: React.PropTypes.array.isRequired,
  },
  render: function (){
    return (
      <table className='table table-bordered table-striped table-hover'>
        <TableHead tableHead={this.props.tableHead} handleChecked = {this.props.handleAllChecked} />
        <TableContent data = {this.props.data} handleChecked = {this.props.handleChecked} />
      </table>
    )
  }
});


var TableHead  = React.createClass({
  getInitialState: function() {
    return {
      isChecked: false
    };
  },
  toggleChange: function() {
    this.setState({isChecked: !this.state.isChecked});
    this.props.handleChecked(!this.state.isChecked);
  },
  render: function (){
    var headNodes = this.props.tableHead.map(function (headInfo, i){
      return <th key={'head'+i}>{headInfo}</th>
    })

    return (
      <thead className='tableHead'>
      <tr>
        <th>
        <input type='checkbox'  name='selectAll' checked={this.state.isChecked} onChange={this.toggleChange}/>
        </th>
        {headNodes}
      </tr>
      </thead>
    )
  }
});
var TableContent = React.createClass({

  render: function(){
    var rowNodes = this.props.data.map(function(tableList, i){
      return (
        <RowNode fruitName = {tableList.fruitName}
                 color={tableList.color}
                 key={i}
                 index={i}
                 isChecked = {tableList.checked}
                 handleChecked = {this.props.handleChecked}
        />
      )
    }.bind(this));

    return (
      <tbody className='tableBody'>
      {rowNodes}
      </tbody>
    )
  }
})


var RowNode = React.createClass({
  toggleChange: function() {
    /*var elem = ReactDOM.findDOMNode(this);

     if (this.state.isChecked === false){
     elem.classList.add('active');
     }else{
     elem.classList.remove('active');
     }*/

    this.props.handleChecked({index: this.props.index, isChecked: !this.props.isChecked});
  },

  render: function(){
    return (
      <tr data-index={this.props.index}>
         <th>
          <input type='checkbox' name='item' checked={this.props.isChecked} onChange={this.toggleChange} />
        </th>
        <td>{this.props.fruitName}</td>
        <td>{this.props.color}</td>
      </tr>
    )
  }
});


ReactDOM.render(
  <MainWrapper head={['fruitName', 'color']} data = {fruitsJson} />,
  document.getElementById('content')

);



