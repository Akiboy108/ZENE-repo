<?php
    if (!file_exists('frontend/user/')) {
        mkdir('frontend/music/', 0777, true);
    }

    $FileName=$_FILES['fuResume']['name'];

    $target = "music/".$FileName;

    $TmpName=$_FILES['fuResume']['tmp_name'];

    move_uploaded_file($TmpName,$target);
?>