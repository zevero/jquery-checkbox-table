/*jshint maxcomplexity:16*/
// https://github.com/zevero/jquery-checkbox-table
(function ( $ ) {
  'use strict';
  var opts;
    
  function setCheckbox(c,v){ //only from unchecked state
    if (v>0) c.checked = true;
    if (v<0) c.indeterminate=c.readOnly=true;
  }
  
  function getCheckbox(c){
    return c.indeterminate?-1:c.checked?1:0;
  }

  function tristate($this){
    $this.on('click','input[type=checkbox]', function(){            //1st click is normal (and will fall through)
       if (this.readOnly) this.checked=this.readOnly=false;                     //3rd click will uncheck (and unset readonly)
       else if (!this.checked) this.readOnly=this.indeterminate=true;     //2nd click sets indeterminated (and readonly)
    });
  }
  
  function readTable($this){
    var a={matrix:[],cols:opts.cols,rows:opts.rows};
    $this.find('table tbody tr').each(function(){
      var l=[];
      $(this).find('input').each(function(){
        l.push(getCheckbox(this));
      });
      a.matrix.push(l);
    });
    return a;
  }
  
  function createTable($this,opts_){
    var x,y,$checkbox,checkbox,$tr=$('<tr>'),$tbody=$('<tbody>'),$thead=$('<thead>'),$table=$('<table>');
    var hasColHeader = typeof opts_.cols !=='number';
    var hasRowHeader = typeof opts_.rows !=='number';
    opts_.x = hasColHeader?opts_.cols.length:opts_.cols;
    opts_.y = hasRowHeader?opts_.rows.length:opts_.rows;
    var first = !opts;
    if (!first && opts_.lax && !$this.is(':empty') && opts_.x === opts.x && opts_.y === opts.y) { //lax option
      var m = readTable($this).matrix;
      if (m && m.length === opts.x && m[0].length === opts.y) opts_.set = m;
    }
    if (first && opts_.tristate) tristate($this);
    opts = opts_;
    $this.empty();
    if (hasRowHeader) {
      if (hasColHeader) $tr.append('<td>&nbsp;</td>');
      for(x=0;x<opts.x;x++) $tr.append($('<td>').append(opts.cols[x]));
      $thead.append($tr);
      $table.append($thead);
    }
    
    for(y=0;y<opts.y;y++){
      $tr = $('<tr>');
      hasColHeader && $tr.append($('<th>').append(opts.rows[y]));
      for(x=0;x<opts.x;x++){
        $checkbox = $('<input type="checkbox">');
        checkbox = $checkbox[0];
        $tr.append($('<td>').append($checkbox));
        
        if (!opts.set) continue; 
        var v = (typeof opts.set === 'function')?opts.set(x,y):opts.set[y][x];
        setCheckbox(checkbox,v);
      }
      $tbody.append($tr);
    }
    $table.append($tbody);
    $this.append($table);
    
  }
  
  
  $.fn.checkbox_table = function(opts) {
    if (!opts) return readTable($(this));
    createTable($(this),opts);
    return this;
  };
  
}( jQuery ));