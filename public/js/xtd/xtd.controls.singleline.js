try {
	XTD.factories = XTD.factories || {};
	XTD.factories.SinglelineFactory = XTD.factories.SinglelineFactory || (function () {
		return {
			name: 'singleline', 
			display: '單行文字',
			icon: 'fa-edit',
			create: function (definition) {
				return new XTD.controls.Singleline(definition);
			},
			createEditable: function (definition) {
				return new XTD.controls.EditableSingleline(definition);
			}
		}
	})();
	
	XTD.controls = XTD.controls || {};
	XTD.controls.Singleline = function(definition) {
		this.__proto__ = new XTD.definitions.Item(definition.name, (definition.properties.common)?definition.properties.common.display:'');
		this.definition = definition;
		this.definition.properties.common.display = this.definition.properties.common.display || new XTD.properties.DefaultPropertyDefinition('common', 'display', 'display', 'TextBox');
		this.definition.properties.common.default_value = this.definition.properties.common.default_value || new XTD.properties.DefaultPropertyDefinition('common', 'default_value', '', 'TextBox');
		this.definition.properties.common.placeholder = this.definition.properties.common.placeholder || new XTD.properties.DefaultPropertyDefinition('common', 'placeholder', '', 'TextBox');
		this.definition.properties.common.tooltips = this.definition.properties.common.tooltips || new XTD.properties.DefaultPropertyDefinition('common', 'tooltips', '', 'TextBox');
		this.definition.properties.common.maxlength = this.definition.properties.common.maxlength || new XTD.properties.DefaultPropertyDefinition('common', 'maxlength', '', 'TextBox');
		this.definition.properties.common.is_searchable = this.definition.properties.common.is_searchable || new XTD.properties.DefaultPropertyDefinition('common', 'is_searchable', '0', 'CheckBox');
		this.definition.properties.common.is_show_in_list = this.definition.properties.common.is_show_in_list || new XTD.properties.DefaultPropertyDefinition('common', 'is_show_in_list', '1', 'CheckBox');
		this.definition.properties.common.is_show_in_mobile_list = this.definition.properties.common.is_show_in_mobile_list || new XTD.properties.DefaultPropertyDefinition('common', 'is_show_in_mobile_list', '1', 'CheckBox');
		this.definition.properties.common.sort_sequence = this.definition.properties.common.sort_sequence || new XTD.properties.DefaultPropertyDefinition('common', 'sort_sequence', '', 'TextBox');
		this.definition.properties.layout.width = this.definition.properties.layout.width || new XTD.properties.DefaultPropertyDefinition('layout', 'width', '', 'TextBox');
		this.definition.properties.layout.height = this.definition.properties.layout.height || new XTD.properties.DefaultPropertyDefinition('layout', 'height', '', 'TextBox');
		this.definition.properties.layout.horizontalAlignment = this.definition.properties.layout.horizontalAlignment || new XTD.properties.DefaultPropertyDefinition('layout', 'horizontalAlignment', '', 'TextBox');
		this.definition.properties.layout.verticalAlignment = this.definition.properties.layout.verticalAlignment || new XTD.properties.DefaultPropertyDefinition('layout', 'verticalAlignment', '', 'TextBox');
		this.definition.properties.layout.marginTop = this.definition.properties.layout.marginTop || new XTD.properties.DefaultPropertyDefinition('layout', 'marginTop', '', 'TextBox');
		this.definition.properties.layout.marginRight = this.definition.properties.layout.marginRight || new XTD.properties.DefaultPropertyDefinition('layout', 'marginRight', '', 'TextBox');
		this.definition.properties.layout.marginBottom = this.definition.properties.layout.marginBottom || new XTD.properties.DefaultPropertyDefinition('layout', 'marginBottom', '', 'TextBox');
		this.definition.properties.layout.marginLeft = this.definition.properties.layout.marginLeft || new XTD.properties.DefaultPropertyDefinition('layout', 'marginLeft', '', 'TextBox');
		this.definition.properties.brush.backgroundColor = this.definition.properties.brush.backgroundColor || new XTD.properties.DefaultPropertyDefinition('brush', 'backgroundColor', '', 'TextBox');
		this.definition.properties.brush.backgroundImage = this.definition.properties.brush.backgroundImage || new XTD.properties.DefaultPropertyDefinition('brush', 'backgroundImage', '', 'TextBox');
		this.definition.properties.brush.foregroundColor = this.definition.properties.brush.foregroundColor || new XTD.properties.DefaultPropertyDefinition('brush', 'foregroundColor', '', 'TextBox');
		this.definition.properties.text.size = this.definition.properties.text.size || new XTD.properties.DefaultPropertyDefinition('text', 'size', '', 'TextBox');
		this.definition.properties.text.weight = this.definition.properties.text.weight || new XTD.properties.DefaultPropertyDefinition('text', 'weight', '', 'TextBox');
		this.definition.properties.text.textDecoration = this.definition.properties.text.textDecoration || new XTD.properties.DefaultPropertyDefinition('text', 'textDecoration', '', 'TextBox');
		this.definition.properties.text.style = this.definition.properties.text.style || new XTD.properties.DefaultPropertyDefinition('text', 'style', '', 'TextBox');
		//this.definition.properties.text.style = this.definition.properties.text.style || new XTD.validators.List('validation','list','','');

		for (var i = 0; i<this.definition.validations.length; i++){
			this.validators.add(XTD.factories[this.definition.validations[i].type+"Factory"].create(this.definition.validations[i]));
		}

		if (this.definition.id) {
			this.__id = this.definition.id;
		}
		var $this = this;
		this.initialize = function () {
			this.properties.add(XTD.factories.PropertyFactory.generate(this.definition.properties.common.display).setParent(this).subscribe(function (value) {
				$('#lbl_'+$(this).attr('data-parent-id')).html(value);
			}));
			this.properties.add(XTD.factories.PropertyFactory.generate(this.definition.properties.common.default_value).setParent(this).subscribe(function (value) {
				$('#'+$(this).attr('data-parent-id')).val(value);
			}));
			this.properties.add(XTD.factories.PropertyFactory.generate(this.definition.properties.common.placeholder).setParent(this).subscribe(function (value) {
				$('#'+$(this).attr('data-parent-id')).attr('placeholder', value);
			}));
			this.properties.add(XTD.factories.PropertyFactory.generate(this.definition.properties.common.tooltips).setParent(this).subscribe(function (value) {
				$('#'+$(this).attr('data-parent-id')).attr('title', value);
			}));
			this.properties.add(XTD.factories.PropertyFactory.generate(this.definition.properties.common.maxlength).setParent(this).subscribe(function (value) {
				$('#'+$(this).attr('data-parent-id')).attr('maxlength', value);
			}));
			this.properties.add(XTD.factories.PropertyFactory.generate(this.definition.properties.common.is_searchable).setParent(this));
			this.properties.add(XTD.factories.PropertyFactory.generate(this.definition.properties.common.is_show_in_list).setParent(this));
			this.properties.add(XTD.factories.PropertyFactory.generate(this.definition.properties.common.is_show_in_mobile_list).setParent(this));
			this.properties.add(XTD.factories.PropertyFactory.generate(this.definition.properties.common.sort_sequence).setParent(this));
			
			this.properties.add(XTD.factories.PropertyFactory.generate(this.definition.properties.layout.width).setParent(this).subscribe(function (value) {
				$('#'+$(this).attr('data-parent-id')).css('width', value);
			}));
			this.properties.add(XTD.factories.PropertyFactory.generate(this.definition.properties.layout.height).setParent(this).subscribe(function (value) {
				$('#'+$(this).attr('data-parent-id')).css('height', value);
			}));
			this.properties.add(XTD.factories.PropertyFactory.generate(this.definition.properties.layout.horizontalAlignment).setParent(this).subscribe(function (value) {
				$('#'+$(this).attr('data-parent-id')).css('text-aign', value);
			}));
			this.properties.add(XTD.factories.PropertyFactory.generate(this.definition.properties.layout.verticalAlignment).setParent(this).subscribe(function (value) {
				$('#'+$(this).attr('data-parent-id')).css('vertical-align', value);
			}));
			this.properties.add(XTD.factories.PropertyFactory.generate(this.definition.properties.layout.marginTop).setParent(this).subscribe(function (value) {
				$('#'+$(this).attr('data-parent-id')).css('margin-top', value);
			}));
			this.properties.add(XTD.factories.PropertyFactory.generate(this.definition.properties.layout.marginRight).setParent(this).subscribe(function (value) {
				$('#'+$(this).attr('data-parent-id')).css('margin-right', value);
			}));
			this.properties.add(XTD.factories.PropertyFactory.generate(this.definition.properties.layout.marginBottom).setParent(this).subscribe(function (value) {
				$('#'+$(this).attr('data-parent-id')).css('margin-bottom', value);
			}));
			this.properties.add(XTD.factories.PropertyFactory.generate(this.definition.properties.layout.marginLeft).setParent(this).subscribe(function (value) {
				$('#'+$(this).attr('data-parent-id')).css('margin-left', value);
			}));
			this.properties.add(XTD.factories.PropertyFactory.generate(this.definition.properties.brush.backgroundColor).setParent(this).subscribe(function (value) {
				$('#'+$(this).attr('data-parent-id')).css('background-color', value);
			}));
			this.properties.add(XTD.factories.PropertyFactory.generate(this.definition.properties.brush.backgroundImage).setParent(this).subscribe(function (value) {
				$('#'+$(this).attr('data-parent-id')).css('background-image', value);
			}));
			this.properties.add(XTD.factories.PropertyFactory.generate(this.definition.properties.brush.foregroundColor).setParent(this).subscribe(function (value) {
				$('#'+$(this).attr('data-parent-id')).css('color', value);
			}));
			this.properties.add(XTD.factories.PropertyFactory.generate(this.definition.properties.text.size).setParent(this).subscribe(function (value) {
				$('#'+$(this).attr('data-parent-id')).css('font-size', value);
			}));
			this.properties.add(XTD.factories.PropertyFactory.generate(this.definition.properties.text.weight).setParent(this).subscribe(function (value) {
				$('#'+$(this).attr('data-parent-id')).css('font-weight', value);
			}));
			this.properties.add(XTD.factories.PropertyFactory.generate(this.definition.properties.text.textDecoration).setParent(this).subscribe(function (value) {
				$('#'+$(this).attr('data-parent-id')).css('text-decoration', value);
			}));
			this.properties.add(XTD.factories.PropertyFactory.generate(this.definition.properties.text.style).setParent(this).subscribe(function (value) {
				$('#'+$(this).attr('data-parent-id')).css('font-style', value);
			}));
			
		};
		this.render = function () {
			var mandatory = "";
			for (var i = 0; i<this.validators.getCount(); i++){
				if (this.validators.at(i).name == "Mandatory") {
					mandatory = '*';
					break;
				}
			}
			//var $id = this.__id;
			var control = $('<div />').attr('id', 'container_'+this.__id).addClass("item-container")
							.append(
								$('<label />').attr('id', 'lbl_'+this.__id).html(this.properties.get('common.display').getValue()) 
								.append($('<label />').html(mandatory).addClass("lbl-mandatory"))
							)
							.append(
								$('<div />').addClass('item-control')
								.append(
									$('<input />').attr('type','text').attr('name', ''+this.__id).attr('id', ''+this.__id).addClass('form-control')
										.val(
											(this.parent.control) ? 
												this.properties.get('common.default_value').getValue()  : 
													this.properties.get('common.default_value').getValue().indexOf('me.') >= 0 ? 
														(this.profile != null) ? 
														this.profile[this.properties.get('common.default_value').getValue().substring(3)] : 
														'' : 
												this.properties.get('common.default_value').getValue()
										)
										.attr('placeholder', this.properties.get('common.placeholder').getValue())
										.attr('title', this.properties.get('common.tooltips').getValue())
										.attr('maxlength', this.properties.get('common.maxlength').getValue())
										.css('width', this.properties.get('layout.width').getValue())
										.css('height', this.properties.get('layout.height').getValue())
										.css('text-aign', this.properties.get('layout.horizontalAlignment').getValue())
										.css('vertical-align', this.properties.get('layout.verticalAlignment').getValue())
										.css('margin-top', this.properties.get('layout.marginTop').getValue())
										.css('margin-right', this.properties.get('layout.marginRight').getValue())
										.css('margin-bottom', this.properties.get('layout.marginBottom').getValue())
										.css('margin-left', this.properties.get('layout.marginLeft').getValue())
										.css('background-color', this.properties.get('brush.backgroundColor').getValue())
										.css('background-image', this.properties.get('brush.backgroundImage').getValue())
										.css('color', this.properties.get('brush.foregroundColor').getValue())
										.css('font-size', this.properties.get('text.size').getValue())
										.css('font-weight', this.properties.get('text.weight').getValue())
										.css('text-decoration', this.properties.get('text.textDecoration').getValue())
										.css('font-style', this.properties.get('text.style').getValue())
										.attr('data-valid', true)
								)
							);
			this.handleProcess(this.definition, control, this.__id);
			//if ( this.definition.processes && this.definition.processes.length > 0 ) {
			//	$.each ( this.definition.processes, function ( i, rule ) {
			//		$.each ( rule.triggers, function ( idx, trigger ) {
			//			control.find("#"+$id).on( trigger.event, function () {
			//				var continueEvent = false;
			//				$.each ( trigger.logics, function ( index, logic ) {
			//					if (logic.gate == "NE") {
			//						if ($( "#"+logic.id ).val() != logic.value) {
			//							continueEvent |= true;
			//						}
			//					}
			//					if (logic.gate == "EQ") {
			//						if ($( "#"+logic.id ).val() == logic.value) {
			//							continueEvent |= true;
			//						}
			//					}
			//					if (logic.gate == "LT") {
			//						if ($( "#"+logic.id ).val() < logic.value) {
			//							continueEvent |= true;
			//						}
			//					}
			//					if (logic.gate == "GT") {
			//						if ($( "#"+logic.id ).val() > logic.value) {
			//							continueEvent |= true;
			//						}
			//					}
			//					if (logic.gate == "LE") {
			//						if ($( "#"+logic.id ).val() <= logic.value) {
			//							continueEvent |= true;
			//						}
			//					}
			//					if (logic.gate == "GE") {
			//						if ($( "#"+logic.id ).val() >= logic.value) {
			//							continueEvent |= true;
			//						}
			//					}
			//					if (logic.gate == "NOT") {
			//						if ($( "#"+logic.id ).val() != logic.value) {
			//							continueEvent |= true;
			//						}
			//					}
			//					if (logic.gate == "BW") {
			//						var s = logic.value.split(',');
			//						if (s[0] <= $( "#"+logic.id ).val() && $( "#"+logic.id ).val() <= s[1]) {
			//							continueEvent |= true;
			//						}
			//					}
			//					if (logic.gate == "NBW") {
			//						if ($( "#"+logic.id ).val() <= s[0] || s[1] <= $( "#"+logic.id ).val()) {
			//							continueEvent |= true;
			//						}
			//					}
			//					if (logic.gate == "CT") {
			//						if ($( "#"+logic.id ).val().indexOf(logic.value) >= 0) {
			//							continueEvent |= true;
			//						}
			//					}
			//					if (logic.gate == "NCT") {
			//						if ($( "#"+logic.id ).val().indexOf(logic.value) < 0) {
			//							continueEvent |= true;
			//						}
			//					}
            //
			//					if (!continueEvent) {
			//						return false;
			//					}
			//				});
			//				if (continueEvent) {
			//					$.each ( rule.results, function ( index, result ) {
			//						XTD.handlers[result.handler].fire(result.target, result.parameters);
			//					});
			//				} else {
			//					$.each ( rule.results, function ( index, result ) {
			//						XTD.handlers[result.handler].revise(result.target, result.parameters);
			//					});
			//				}
			//			});
			//		});
			//	});
			//}
			return control;
		};
		
		//this.serialize = function () {
		//};
		
		this.initialize();
		
		return this;
	};
	XTD.controls.EditableSingleline = function(definition) {
		this.__proto__ = new XTD.definitions.EditableItem(definition.name, definition.properties.common.display);
		this.control = new XTD.controls.Singleline(definition).setParent(this);
		this.render = function () {
			var output = this.control.render();
			$("<div />").addClass("pull-left del-box box-tools").append('<button type="button" class="btn btn-info btn-xs" data-id="'+this.control.definition.name+'" title="Remove" onclick="remove(this)"><i class="fa fa-remove"></i></button>').insertAfter(output.find('#lbl_'+this.control.__id));
			var properties = this.control.properties;
			var $this = this;
			output.bind('click', function () {
				$this.fire(properties, this);
			});
			
			return output;
		};

		return this;
	};

} catch (e) {
 console.log(e);
}

