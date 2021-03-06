<?php
namespace App\Models;

class FormItems extends BaseModel {
	protected $connection = 'form_definition';
	protected $table = 'form_items';
			
	public function form()
	{
		return $this->belongsTo('App\Models\Forms', 'form_id', 'id')->where('forms.status', STATUS_ACTIVE);
	}	

	public function permissions()
	{
		return $this->morphMany('\App\Models\Permissions', 'target')->where('status',STATUS_ACTIVE);
	}	
	
	public function all_permissions()
	{
		return $this->morphMany('\App\Models\Permissions', 'target');
	}	

	public function properties()
	{
		return $this->morphMany('\App\Models\ItemProperties', 'target')->where('status', STATUS_ACTIVE)->orderBy('sequence');
	}	

	public function all_properties()
	{
		return $this->morphMany('\App\Models\ItemProperties', 'target')->orderBy('sequence');
	}	
	
	public function glossaries()
    {
        return $this->morphMany('\App\Models\Glossaries', 'target')->where('status',STATUS_ACTIVE);
    }
}