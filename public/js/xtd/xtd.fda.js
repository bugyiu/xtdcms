if (XTD) {
	$.cachedScript(BASE_URL + '/min/g/formjs');
	XTD.FDA = XTD.FDA || function (definition, editable) {
		this.__itemContainerId = '';
		this.__propertyContainerId = '';
		this.__controlContainerId = '';
		
		this.definition = definition;
		this.form = {};
		if (editable) {
			this.form = new XTD.definitions.EditableForm(this.definition);
		} else {
			this.form = new XTD.definitions.Form(this.definition);
		}

		this.setItemContainerId = function (id) {
			this.__itemContainerId = id;
			
			return this;
		};
		this.setControlContainerId = function (id) {
			this.__controlContainerId = id;
		
			var controlContainer = $("#"+this.__controlContainerId);
			for (var name in XTD.factories) {
				if (XTD.factories[name].name) {
					$("<div />").addClass("control-item").addClass("fa fa-edit").attr('data-factory', name).html(XTD.factories[name].display).appendTo(controlContainer);
				}
			}

			$(".control-item").click(function () {
				var item = $(this);
				fda.addItem(new XTD.properties.DefaultDefinition(XTD.SequenceGenerator.getNextCounter() , item.html(), item.attr('data-factory').toString().replace('Factory','')));
				fda.renderAll();
			});
			
			return this;
		};
		this.setPropertyContainerId = function (id) {
			this.__propertyContainerId = id;
			
			return this;
		};
		
		this.changeControlHandler = function (item, scope) {
			$('#' + $this.__propertyContainerId).empty();
			$(".selected").removeClass("selected");
			$(scope).addClass("selected");
			var group = '';
			item.each(function (property) {
				if (group != property.property.group) {
					group = property.property.group;
					$('#' + $this.__propertyContainerId).append($('<h3 />').html(XTD.__(group)).addClass('control-sidebar-heading'));
				}
				$('#' + $this.__propertyContainerId).append($(property.render()));
			});
			$(".nav-tabs a[href='#control-sidebar-properties-tab']").tab('show');
		};
		
		this.renderAll = function () {
			$('#' + $this.__itemContainerId).empty().append($($this.form.render()));
			if ($('#' + $this.__itemContainerId).children().size() == 0){
				$('#' + $this.__itemContainerId).append(
					$("<div />").addClass("empty_control_hints").html(XTD.__("Please drag control from right hand side into here"))
				);
			} else {
				$this.form.items.each(function (item) {
					if ( item.definition.processes && item.definition.processes.length > 0 ) {
						$.each ( item.definition.processes, function ( i, rule ) {
							$.each ( rule.results, function ( index, result ) {
								XTD.handlers[result.handler].revise(result.target, result.parameters);
							});
						});
					}
				});
			}
		};
		
		this.addItem = function (definition) {
			//console.log($this.form);
			$this.form.control.addItem(definition);
		};
		
		this.insertItem = function (index, definition) {
			//console.log($this.form);
			$this.form.control.insertItem(index, definition);
		};
		
		this.removeItem = function (index) {
			$this.form.control.removeItem(index);
		};
		
		this.serializeItem = function () {
			return this.form.control.definition;
		};
		
		this.serializeValue = function () {
			var result = {};
			$this.form.items.each(function (property) {
				result[property.__id] = $("[name=" + property.__id + "]").val();
			});
			//return this.form.serialize();
			return result;
		};
		
		this.validate = function () {
			var validateResult = { valid: true, message: '' };
			$this.form.items.each(function (property) {
				if (typeof property.validate == "function") {
					var result = property.validate();
					if (!result.valid) {
						validateResult.valid = false;
						validateResult.message += result.message + "\n";
					}
				}
			});
			
			return validateResult;
		};

		if (editable) {
			this.form.setChangeControlHandler(this.changeControlHandler);
		}
		var $this = this;
	};
}