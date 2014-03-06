Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    scopeType: 'release',
    comboboxConfig: {
        fieldLabel: 'Select a Release:',
        labelWidth: 100,
        width: 300
    },
    
launch: function() {
        var that = this;
        var release;
   	var relComboBox = Ext.create('Rally.ui.combobox.ReleaseComboBox',{
   		listeners:{
   			ready: function(combobox){
   				release = combobox.getRecord(); 
   				this._loadDefects(release);
   			},
   			select: function(combobox){
   				release = combobox.getRecord(); 
   				this._loadDefects(release);
   			},
   			scope: this
   		}
   	});
   	this.add(relComboBox);
   },
   
   _loadDefects: function(release){
        var releaseRef;
        var releaseStart = Rally.util.DateTime.toIsoString(release.get('ReleaseStartDate'),true);
        console.log('releaseStart', releaseStart);
   	releaseRef = release.get('_ref');
   	var myStore = Ext.create('Rally.data.WsapiDataStore',{
   		model: 'Defect',
   		autoLoad:true,
   		fetch: ['Name','State','FormattedID','CreationDate'],
   		filters:[
   			{
   				property : 'Release',
   				operator : '=',
   				value : releaseRef
   			},
                        {
   				property : 'CreationDate',
   				operator : '<=',
   				value : releaseStart
   			},
                        
   		],
   		listeners: {
   			load: function(store,records,success){
   				console.log("loaded %i records", records.length);
   				this._updateGrid(myStore);
   			},
   			scope:this
   		}
   	});
   },
   
   _createGrid: function(myStore){
   	this._myGrid = Ext.create('Ext.grid.Panel', {
   		title: 'Defects by Release',
   		store: myStore,
   		columns: [
   		        {text: 'ID', dataIndex: 'FormattedID', xtype: 'templatecolumn',
                            tpl: Ext.create('Rally.ui.renderer.template.FormattedIDTemplate')},
                        {text: 'CreationDate', dataIndex: 'CreationDate', flex: 2},
   			{text: 'Name', dataIndex: 'Name', flex: 2},
   			{text: 'State', dataIndex: 'State', flex: 1}
   		],
   		height: 400
   	});
   	this.add(this._myGrid);
   },
   
   _updateGrid: function(myStore){
   	if(this._myGrid === undefined){
   		this._createGrid(myStore);
   	}
   	else{
   		this._myGrid.reconfigure(myStore);
   	}
   }
   
   });