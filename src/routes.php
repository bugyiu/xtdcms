<?php
// Routes

// API will all redirect to api controller
$app->group('/api', 'App\Controllers\ApiController')->add('\App\Middlewares\AuthenticateMiddleware::authHeader');//->add('\App\Middlewares\LZStringMiddleware::decryptString');

// minify the static file (css, js) and add cache header
$app->get('/min/f/{f:.*}', function ($request, $response, $args) use ($app, $container) {
	$_GET['f'] = $args['f'];
	$b = substr(dirname($_SERVER['SCRIPT_NAME']), 1);
	if (!empty($b)) {
		$_GET['b'] = $b;
	}

	require __DIR__ .'/../../vendor/mrclay/minify/min/index.php';
	exit;
});
$app->get('/min/g/{g:.*}', function ($request, $response, $args) use ($app, $container) {
	$_GET['g'] = $args['g'];
	$b = substr(dirname($_SERVER['SCRIPT_NAME']), 1);
	if (!empty($b)) {
		$_GET['b'] = $b;
	}

	require __DIR__ .'/../../vendor/mrclay/minify/min/index.php';
	exit;
});
/*
$app->get('/cmlist', function ($request, $response, $args) use ($app, $container) {
	$modules = array(
										'singleline' => 'modules/singeline',
									);
	$response->withJson($modules);
})->add('\App\Middlewares\AuthenticateMiddleware::authHeader')->add('\App\Middlewares\AuthenticateMiddleware::authUser');

$app->get('/modules/{file}', function ($request, $response, $args) use ($app, $container) {
	echo 'a';
});
*/
$app->get('/folder/{id}', function ($request, $response, $args) use ($app, $container) {
	$id = isset($args['id']) ? $args['id'] : '0';
	$can_read = has_folder_permission($id, PERMISSION_READ);
	$can_create = has_folder_permission($id, PERMISSION_CREATE);
	//$can_add = has_folder_permission($id, PERMISSION_ADD);
	if ($can_read) {
		$folder = \App\Models\Folders::find($id);
		$args['can_create'] = $can_create;
		//$args['can_add'] = $can_add;
		if (!empty($folder)) {
			$args['folder'] = $folder;
		}
		return $this->view->render($response, 'folder.details.html', $args);
	} else {
		$url = $container->router->pathFor('dashboard');
		return $response->withRedirect($url);
	}
})->setName("folder.details");

$app->get('/group/{id}', function ($request, $response, $args) use ($app, $container) {
	$id = isset($args['id']) ? $args['id'] : '0';
	$group = \App\Models\Groups::find($id);
	if (!empty($group)) {
		$args['group'] = $group;
	}
	$args['permission_none'] = 			ACCESS_RIGHT_NO;
	$args['permission_create'] = 		ACCESS_RIGHT_CREATE;
	$args['permission_update'] = 		ACCESS_RIGHT_UPDATE;
	$args['permission_view'] = 			ACCESS_RIGHT_READ;
	$args['permission_delete'] = 		ACCESS_RIGHT_DELETE;
	$args['permission_add'] = 				ACCESS_RIGHT_ADD;
	$args['permission_remove'] = 	ACCESS_RIGHT_REMOVE;
	
	$users = \App\Models\Members::where('status','=',STATUS_ACTIVE)->get();
	
	$args['users'] = 	$users;
	
	return $this->view->render($response, 'group.details.html', $args);
})->setName("group.details");

$app->get('/login', function ($request, $response, $args) use ($app, $container) {
	return $this->view->render($response, 'signin.html', $args);
})->setName('member.signin');

$app->get('/member/profile', function ($request, $response, $args) use ($app, $container) {
	return $this->view->render($response, 'member.profile.html', $args);
})->setName('member.profile');

$app->get('/member/list', function ($request, $response, $args) use ($app, $container) {
	$args['permission_none'] = 			ACCESS_RIGHT_NO;
	$args['permission_create'] = 		ACCESS_RIGHT_CREATE;
	$args['permission_update'] = 		ACCESS_RIGHT_UPDATE;
	$args['permission_view'] = 			ACCESS_RIGHT_READ;
	$args['permission_delete'] = 		ACCESS_RIGHT_DELETE;
	$args['permission_add'] = 			ACCESS_RIGHT_ADD;
	$args['permission_remove'] = 	ACCESS_RIGHT_REMOVE;
	
	return $this->view->render($response, 'member.list.html', $args);
})->setName('member.list');

$app->get('/js/variable', function ($request, $response, $args) use ($app, $container) {
	return $this->view->render($response, 'variable.html', $args);
})->setName('variable');

$app->get('/js/static-glossaries', function ($request, $response, $args) use ($app, $container) {
	$wordings = \App\Models\StaticContents::all();
	$result = [];
	foreach ($wordings as $wording) {
		$glossary = $wording->glossaries()->where('language','zh-cn')->first();
		if (!empty($glossary)) {
			$result[$wording->content] = $glossary->content;
		} else {
			$result[$wording->content] = $wording->content;
		}
	}
	return $response->withJson($result);//$this->view->render($response, 'glossary.html', $args);
})->setName('variable');

$app->get('/translate', function ($request, $response, $args) use ($app, $container) {
	return $this->view->render($response, 'translate.html', $args);
})->setName("translate");

$app->get('/search', function ($request, $response, $args) use ($app, $container) {
	return $this->view->render($response, 'search.html', $args);
})->setName('search');

$app->get('/form/create/{folder_id}', function ($request, $response, $args) use ($app, $container) {
	//$args['id'] = '';
	$folder_id = (isset($args['folder_id'])) ? $args['folder_id'] : '';

	$can_create = has_folder_permission($folder_id, PERMISSION_CREATE);
	if ($can_create) {
		$args['key'] = generateRandomString();
		$args['domain'] = $_SERVER['SERVER_NAME'];
		return $this->view->render($response, 'form.edit.html', $args);
	} else {
		$url = $container->router->pathFor('dashboard');
		return $response->withRedirect($url);
	}
})->setName("form.create");

$app->get('/form/success', function ($request, $response, $args) use ($app, $container) {
	$args['route'] = 'form';
	return $this->view->render($response, 'form.success.html', $args);
})->setName("form.submit.success");

$app->get('/form/{id}/edit', function ($request, $response, $args) use ($app, $container)  {
	$id = (isset($args['id'])) ? $args['id'] : '';
	$can_update = has_form_permission($id, PERMISSION_UPDATE);
	if ($can_update) {
		$alias = \App\Models\FormAliases::where('form_id','=',$id)->first();
		if (empty($alias)) {
			$args['key'] = generateRandomString();
		} else {
			$args['key'] = $alias->alias;
		} 
		$args['domain'] = $_SERVER['SERVER_NAME'];
		return $this->view->render($response, 'form.edit.html', $args);
	} else {
		$url = $container->router->pathFor('dashboard');
		return $response->withRedirect($url);
	}
})->setName("form.edit");

$app->get('/form/{id}/modify', function ($request, $response, $args) use ($app, $container)  {
	$id = (isset($args['id'])) ? $args['id'] : '';
	$can_update = has_form_permission($id, PERMISSION_UPDATE);
	if ($can_update) {
		return $this->view->render($response, 'form.modify.html', $args);
	} else {
		$url = $container->router->pathFor('dashboard');
		return $response->withRedirect($url);
	}
})->setName("form.modify");

$app->get('/form/view/{id}/[{data_id}]', function ($request, $response, $args) use ($app, $container)  {
	$id = (isset($args['id'])) ? $args['id'] : '';
	$data_id = (isset($args['data_id'])) ? $args['data_id'] : '';
	$data = \App\Models\FormDatas::find($data_id);
	if (!empty($data)) {
		//$args['id'] = $data->form_id;
		//$args['data_id'] = $id;
		//$data_id = $id;
		//$id = $data->form_id;
		$can_read = has_form_permission($id, PERMISSION_READ);
		$can_update = has_form_permission($id, PERMISSION_UPDATE);
		$can_modify = has_form_permission($id, PERMISSION_ACCESS_ADD);
		$can_delete = has_form_permission($id, PERMISSION_DELETE);
		$args['can_update'] = $can_update;
		$args['can_modify'] = $can_modify;
		$args['can_delete'] = $can_delete;
		if ($can_read) {
			return $this->view->render($response, 'form.view.html', $args);
		} else {
			$url = $container->router->pathFor('dashboard');
			return $response->withRedirect($url);
		}
	}
})->setName("formdata.form.view");

$app->get('/form/list/[{id}]', function ($request, $response, $args) use ($app, $container)  {
	$id = (isset($args['id'])) ? $args['id'] : '';
	$form = \App\Models\Forms::find($id);
	
	if (!empty($form)) {
		$can_read = has_form_permission($id, PERMISSION_READ);
		$can_create = has_form_permission($id, PERMISSION_CREATE);
		$can_update = has_form_permission($id, PERMISSION_UPDATE);
		$args['can_create'] = $can_create;
		$args['can_update'] = $can_update;
		if ($can_read) {
			return $this->view->render($response, 'form.list.html', $args);
		} else {
			$url = $container->router->pathFor('dashboard');
			return $response->withRedirect($url);
		}
	}
})->setName("formdata.form.list");

$app->get('/form/[{id}]', function ($request, $response, $args) use ($app, $container)  {
	$id = (isset($args['id'])) ? $args['id'] : '';
	$can_read = has_form_permission($id, PERMISSION_READ);
	$can_update = has_form_permission($id, PERMISSION_UPDATE);
	$can_modify = has_form_permission($id, PERMISSION_ACCESS_ADD);
	$can_delete = has_form_permission($id, PERMISSION_DELETE);
	$args['can_update'] = $can_update;
	$args['can_modify'] = $can_modify;
	$args['can_delete'] = $can_delete;

	if ($can_read) {
		return $this->view->render($response, 'form.html', $args);
	} else {
		$url = $container->router->pathFor('dashboard');
		return $response->withRedirect($url);
	}
})->setName("formdata.form");

$app->get('/thankyou', function ($request, $response, $args) use ($app, $container)  {
	return $this->view->render($response, 'thankyou.public.html', $args);
})->setName("formdata.form.public.thankyou");

$app->get('/f/[{alias}]', function ($request, $response, $args) use ($app, $container)  {
	$alias = (isset($args['alias'])) ? $args['alias'] : '';
	$value = \App\Models\FormAliases::where('status','=',STATUS_ACTIVE)->where('alias','=',$alias)->get()->first();
	if (!empty($value)) {
		$id = $value->id;
		
		$continue = empty($value->password);
		if (!empty($value->password) && true){
		}
		
		if ($continue) {
			if (empty($container['auth.manager']->getToken())) {
				$container['auth.manager']->setSessionToken($container['auth.manager']->getAnonymousToken());
			}
			$args['id'] = $value->form_id;
		//$can_read = has_form_permission($id, PERMISSION_READ);
		//$can_update = has_form_permission($id, PERMISSION_UPDATE);
		//$can_modify = has_form_permission($id, PERMISSION_ACCESS_ADD);
		//$can_delete = has_form_permission($id, PERMISSION_DELETE);
		//$args['can_update'] = $can_update;
		//$args['can_modify'] = $can_modify;
		//$args['can_delete'] = $can_delete;

			return $this->view->render($response, 'form.public.html', $args);
		} else {
			return $this->view->render($response, 'enter.password.html', $args);
		}
	} else {
		$url = $container->router->pathFor('member.signin');
		return $response->withRedirect($url);
	}
})->setName("formdata.form.public");





$app->get('/player', function ($request, $response, $args) use ($app, $container) {
	return $this->view->render($response, 'video.html', $args);
});

$position = 300;
$app->get('/playlist', function ($request, $response, $args) use ($app, $container, $position) {
	$size = 1024 * $position;
	$filename = __DIR__.'/../public/video/843bbd58c1b80fe084f34b6720f9864b.mp4';
	$stream = new StreamingManager($filename);
	$stream->start();
	//$filesize = filesize($filename);
	//$handle = fopen($filename, 'rb');
	//$size = min($size, $filesize);
	//$content = fread($handle, $size);
    //
	//$result = [];
	//$result['video'] = [];
	//$result['video']['format'] = 'mp4';
	//$result['video']['mime_type'] = 'video/mp4';
	//$result['video']['width'] = '640';
	//$result['video']['height'] = '360';
	//$result['video']['init_segment'] = base64_encode($content);
	//$result['video']['segments'] = [];
	//$segment_count = round($filesize / $size);
	//for ($i = 1; $i < $segment_count; $i++) {
	//	$result['video']['segments'][] = array('segment'=>$i, 'url'=>'./video/'.$i);
	//}
	//fclose($handle);
	//$response->withJson($result);
});

$app->get('/video/{segment}', function ($request, $response, $args) use ($app, $container, $position) {
	$size = 1024 * $position;
	$filename = __DIR__.'/../public/video/843bbd58c1b80fe084f34b6720f9864b.mp4';
	$filesize = filesize($filename);
	$offset = $args['segment'] * $size;
	$size = min($size, $filesize - $offset);
	$handle = fopen($filename, 'rb');
	fseek($handle, $offset);
	//echo ftell ( $handle );exit;
	//$content = '';
	//$content .= fread($handle, $size / 2);
	//fseek($handle, 0);
	//fseek($handle, $size / 2);
	//$content .= fread($handle, $size / 2);
	$content = fread($handle, $size);
	echo base64_encode($content);
	
	
	fclose($handle);
});

/*
$app->get('/forms/[{folder_id}]', function ($request, $response, $args) use ($app, $container) {

	$ids = $this->db->select(['max(id) as id'])
					->from('swdata')
					->groupBy('parent_id')
					//->max('version')
					->execute()
					->fetchAll();
	$show_ids = array();
	foreach ($ids as $i) {
		$show_ids[] = $i['id'];
	}
	
	$values = $this->db->select()
					->from('swdata')
					->whereIn('id', $show_ids)
					->orderBy('fruit_name')
					//->groupBy('parent_id')
					//->max('id')
					->execute()
					->fetchAll();
					
	$args['values'] = $values;

	return $this->view->render($response, 'form.list.html', $args);
})->setName("form.list");
*/
$app->post('/folder', function ($request, $response, $args) use ($app, $container) {
	$stmt = $this->db->insert(array('name', 'sequence', 'status', 'created_date', 'created_by', 'last_modified_date', 'last_modified_by'))
                       ->into('folders')
                       ->values(array($_POST['name'], 1, STATUS_ACTIVE, 'NOW()', 'sys', 'NOW()', 'sys'));
	
	$insertId = $stmt->execute(false);

	$url = $container->router->pathFor('form.list');
	return $response->withRedirect($url);
	
})->setName("folder.create.submit");

$app->put('/folder/{id}', function ($request, $response, $args) use ($app, $container) {
	$stmt = $this->db->update(array('name' => $_POST['name'], 'last_modified_date' => 'NOW()', 'last_modified_by' => 'sys'))
                       ->table('folders')
                       ->where('id', '=', $args['id']);
	
	$affectedRows = $stmt->execute();

	$url = $container->router->pathFor('form.list');
	return $response->withRedirect($url);

	})->setName("folder.update.submit");

$app->delete('/folder/{id}', function ($request, $response, $args) use ($app, $container) {
	$stmt = $this->db->update(array('status' => STATUS_DELETED, 'last_modified_date' => 'NOW()', 'last_modified_by' => 'sys'))
                       ->table('folders')
                       ->where('id', '=', $args['id']);
	
	$affectedRows = $stmt->execute();

	$url = $container->router->pathFor('form.list');
	return $response->withRedirect($url);

})->setName("folder.delete.submit");

/*
$app->get('/form/create', function ($request, $response, $args) use ($app, $container) {
	$args['route'] = 'form';
	return $this->view->render($response, 'form.form.html', $args);
})->setName("form.create");

$app->get('/form/{id}', function ($request, $response, $args) use ($app, $container) {
	$values = $this->db->select()
					->from('swdata')
					->where('id','=',$args['id'])
					->orWhere('parent_id','=',$args['id'])
					->orderBy('version', 'DESC')
					->execute()
					->fetch();
	foreach ($values as $key => $value){
		$values[$key] = str_replace(' 00:00:00', '', $value);
	}
	$args['data'] = $values;

	return $this->view->render($response, 'form.details.html', $args);
})->setName("form.details");
$app->get('/form/{id}/edit', function ($request, $response, $args) use ($app, $container) {
	$values = $this->db->select()
					->from('swdata')
					->where('id','=',$args['id'])
					->orWhere('parent_id','=',$args['id'])
					->orderBy('version', 'DESC')
					->execute()
					->fetch();
	foreach ($values as $key => $value){
		$values[$key] = str_replace(' 00:00:00', '', $value);
	}
	$args['data'] = $values;

	return $this->view->render($response, 'form.edit.html', $args);
})->setName("form.edit");

$app->post('/form', function ($request, $response, $args) use ($app, $container) {
	$values = array('sw_time'=>''
								,'sw_time_has_changed'=>'0'
								,'sw_type'=>''
								,'sw_type_has_changed'=>'0'
								,'sw_place'=>''
								,'sw_place_has_changed'=>'0'
								,'guider_qy'=>''
								,'guider_qy_has_changed'=>'0'
								,'guider_name'=>''
								,'guider_name_has_changed'=>'0'
								,'guider_phone'=>''
								,'guider_phone_has_changed'=>'0'
								,'manager_name'=>''
								,'manager_name_has_changed'=>'0'
								,'manager_phone'=>''
								,'manager_phone_has_changed'=>'0'
								,'fruit_name'=>''
								,'fruit_name_has_changed'=>'0'
								,'fruit_status'=>''
								,'fruit_status_has_changed'=>'0'
								,'fruit_phone'=>''
								,'fruit_phone_has_changed'=>'0'
								,'fruit_wechat'=>''
								,'fruit_wechat_has_changed'=>'0'
								,'fruit_qq'=>''
								,'fruit_qq_has_changed'=>'0'
								,'fruit_dept'=>''
								,'fruit_dept_has_changed'=>'0'
								,'fruit_gender'=>''
								,'fruit_gender_has_changed'=>'0'
								,'fruit_birthday'=>''
								,'fruit_birthday_has_changed'=>'0'
								,'tl_level'=>''
								,'tl_level_has_changed'=>'0'
								,'tl_reason'=>''
								,'tl_reason_has_changed'=>'0'
								,'tl_withstand'=>''
								,'tl_withstand_has_changed'=>'0'
								,'tl_withstand_method'=>''
								,'tl_withstand_method_has_changed'=>'0'
								,'remark'=>''
								,'remark_has_changed'=>'0'
								,'submitter'=>''
								,'submitter_has_changed'=>'0'
								,'version'=>'1'
								,'parent_id'=>'0'
								,'upper_id'=>'0'
								,'status'=>STATUS_ACTIVE
								,'createddate'=>'NOW()'
								,'createdby'=>'sys'
								,'lastmodifieddate'=>'NOW()'
								,'lastmodifiedby'=>'sys'
							);
	foreach ($_POST as $key => $value) {
		if (isset($values[$key])) {
			$values[$key] = $value;
		}
	}
	$stmt = $this->db->insert(array_keys($values))
	//array('sw_time','sw_time_has_changed','sw_type','sw_type_has_changed','sw_place','sw_place_has_changed','guider_qy','guider_qy_has_changed','guider_name','guider_name_has_changed','guider_phone','guider_phone_has_changed','manager_name','manager_name_has_changed','manager_phone','manager_phone_has_changed','fruit_name','fruit_name_has_changed','fruit_status','fruit_status_has_changed','fruit_phone','fruit_phone_has_changed','fruit_wechat','fruit_wechat_has_changed','fruit_qq','fruit_qq_has_changed','fruit_dept','fruit_dept_has_changed','fruit_gender','fruit_gender_has_changed','fruit_birthday','fruit_birthday_has_changed','tl_level','tl_level_has_changed','tl_reason','tl_reason_has_changed','tl_withstand','tl_withstand_has_changed','tl_withstand_method','tl_withstand_method_has_changed','remark','remark_has_changed','submitter','submitter_has_changed','version','parent_id','upper_id','status','createddate','createdby','lastmodifieddate','lastmodifiedby'))
                       ->into('swdata')
                       ->values($values);
	
	$insertId = $stmt->execute(true);
	
	$stmt = $this->db->update(array('parent_id'=>$insertId))
                       ->table('swdata')
                       ->where('id', '=', $insertId);
	$affectedRows = $stmt->execute();

	$url = $container->router->pathFor('form.submit.success');
	return $response->withRedirect($url);


	//$app->redirect($app->urlFor('form.submit.success'));
})->setName("form.create.submit");

$app->post('/form/{id}/edit', function ($request, $response, $args) use ($app, $container) {
	$values = $this->db->select()
					->from('swdata')
					->where('id','=',$args['id'])
					->orWhere('parent_id','=',$args['id'])
					->orderBy('version', 'DESC')
					->execute()
					->fetch();
	if ($values['parent_id'] == '0') {
			$values['parent_id'] = $values['id'];
	}
	$values['upper_id'] = $values['id'];
	$values['version'] = $values['version'] + 1;
	$values['lastmodifieddate'] = 'NOW()';
	$values['lastmodifiedby'] = 'sys';
	unset($values['id']);

	foreach ($_POST as $key => $value) {
		if (isset($values[$key])) {
			if ($values[$key] != $value) {
				$values[$key] = $value;
				$values[$key.'_has_changed'] = '1';
			} else {
				$values[$key.'_has_changed'] = '0';
			}
		}
	}
	
	$stmt = $this->db->insert(array_keys($values))
	//array('sw_time','sw_time_has_changed','sw_type','sw_type_has_changed','sw_place','sw_place_has_changed','guider_qy','guider_qy_has_changed','guider_name','guider_name_has_changed','guider_phone','guider_phone_has_changed','manager_name','manager_name_has_changed','manager_phone','manager_phone_has_changed','fruit_name','fruit_name_has_changed','fruit_status','fruit_status_has_changed','fruit_phone','fruit_phone_has_changed','fruit_wechat','fruit_wechat_has_changed','fruit_qq','fruit_qq_has_changed','fruit_dept','fruit_dept_has_changed','fruit_gender','fruit_gender_has_changed','fruit_birthday','fruit_birthday_has_changed','tl_level','tl_level_has_changed','tl_reason','tl_reason_has_changed','tl_withstand','tl_withstand_has_changed','tl_withstand_method','tl_withstand_method_has_changed','remark','remark_has_changed','submitter','submitter_has_changed','version','parent_id','upper_id','status','createddate','createdby','lastmodifieddate','lastmodifiedby'))
                       ->into('swdata')
                       ->values($values);
	//print_r($values);exit;
	
	//echo $stmt->__toString();exit;

	$insertId = $stmt->execute(false);

	$url = $container->router->pathFor('form.submit.success');
	return $response->withRedirect($url);
	//$app->redirect($app->urlFor('form.list'));
})->setName("form.update.submit");

$app->delete('/form/{id}', function ($request, $response, $args) use ($app, $container) {
	$app->redirect($app->urlFor('form.list'));
})->setName("form.delete.submit");
*/

$app->get('/members', function ($request, $response, $args) use ($app, $container) {
	$args['route'] = 'member';
	return $this->view->render($response, 'member.list.html', $args);
})->setName("member.list");

$app->get('/member/create', function ($request, $response, $args) use ($app, $container) {
	$args['route'] = 'member';
	return $this->view->render($response, 'member.form.html', $args);
})->setName("member.create");

$app->get('/member/{id}', function ($request, $response, $args) use ($app, $container) {
	$args['route'] = 'member';
	return $this->view->render($response, 'member.list.html', $args);
})->setName("member.details");

$app->get('/member/{id}/edit', function ($request, $response, $args) use ($app, $container) {
	$args['route'] = 'member';
	return $this->view->render($response, 'member.form.html', $args);
})->setName("member.edit");

$app->post('/member', function ($request, $response, $args) use ($app, $container) {
	$app->redirect($app->urlFor('member.list'));
})->setName("member.create.submit");

$app->put('/member/{id}', function ($request, $response, $args) use ($app, $container) {
	$app->redirect($app->urlFor('member.list'));
})->setName("member.update.submit");

$app->delete('/member/{id}', function ($request, $response, $args) use ($app, $container) {
	$app->redirect($app->urlFor('member.list'));
})->setName("member.delete.submit");



$app->get('/', function ($request, $response, $args) use ($app, $container) {
	$args['route'] = 'dashboard';
	
	//for test permission
	//echo has_folder_permission(6, PERMISSION_READ);
	//echo has_form_permission(1, PERMISSION_READ);
	//$folder= \App\Models\Folders::find(6);
	//$permission = new \App\Models\Permissions();
	//$permission->group_id = 8;
	//$permission->permission = ACCESS_MEMBER_GROUP + ACCESS_RIGHT_READ + ACCESS_RIGHT_UPDATE + ACCESS_RIGHT_CREATE + ACCESS_RIGHT_DELETE;
	//$permission->status = STATUS_ACTIVE;
	//$folder->permissions()->save($permission);
	//echo 'done';
	//exit;
	//$folder= \App\Models\Folders::find(6);
	//foreach ($folder->permissions as $permission){
	//	print_r($permission);
	//}
	//exit;
	
	return $this->view->render($response, 'index.html', $args);
})->setName("dashboard");


$app->get('/test/[{name}]', function ($request, $response, $args) {

	$members = $this->db->select()
			 ->from('members')
			 ->execute()
			 ->fetchAll();
	 $args['data'] = $members;
	 return $this->view->render($response, 'index.html', $args);
	//return $this->view->render($response, 'index.html', [
    //    'name' => $args['name']
    //]);
	
    // Sample log message
    //$this->logger->info("Slim-Skeleton '/' route");
    //
	// // Render index view
    //return $this->renderer->render($response, 'index.phtml', $args);
})->setName("test");

