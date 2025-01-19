<?php 

$info = (Object)[];

	$data = false;
	$data['userid'] = $_SESSION['userid'];
 
	//validate username
	$data['username'] = $DATA_OBJ->username;
	if(empty($DATA_OBJ->username))
	{
		$Error .= "Please enter a valid username . <br>";
		
	}else
	{
		if(strlen($DATA_OBJ->username) < 3)
		{
			$Error .= "username must be at least 3 characters long. <br>";
		}

		if(!preg_match("/^[a-z A-Z]*$/", $DATA_OBJ->username))
		{
			$Error .= "Please enter a valid username . <br>";
		}
 		
	}

	$data['email'] = $DATA_OBJ->email;
	if(empty($DATA_OBJ->email))
	{
		$Error .= "Please enter a valid email . <br>";
	}else
	{
	 
		if(!preg_match("/([\w\-]+\@[\w\-]+\.[\w\-]+)/", $DATA_OBJ->email))
		{
			$Error .= "Please enter a valid email . <br>";
		}
 		
	}

	$data['gender'] = isset($DATA_OBJ->gender) ? $DATA_OBJ->gender : null;
	if(empty($DATA_OBJ->gender))
	{
		$Error .= "Please select a gender . <br>";
	}else
	{
	 
		if($DATA_OBJ->gender != "Male" && $DATA_OBJ->gender != "Female")
		{
			$Error .= "Please select a valid gender . <br>";
		}
 		
	}

	$data['password'] = $DATA_OBJ->password;
	$password = $DATA_OBJ->password2;
	if(empty($DATA_OBJ->password))
	{
		$Error .= "Please enter a valid password . <br>";
	}else
	{
		if($DATA_OBJ->password != $DATA_OBJ->password2)
		{
			$Error .= "passwords must match. <br>";
		}

		if(strlen($DATA_OBJ->password) < 8)
		{
			$Error .= "password must be at least 8 characters long. <br>";
		}
 
	}


	if($Error == "")
	{

 		$query = "update users set username = :username,gender = :gender,email = :email,password = :password where userid = :userid limit 1";
		$result = $DB->write($query,$data);

		if($result)
		{
			
			$info->message = "Your data was saved";
			$info->data_type = "save_settings";
			echo json_encode($info);
		}else
		{

			$info->message = "Your data was NOT saved due to an error";
			$info->data_type = "save_settings";
			echo json_encode($info);

		}
	}else
	{
		$info->message = $Error;
		$info->data_type = "save_settings";
		echo json_encode($info);
	}
