/*
 Navicat Premium Data Transfer

 Source Server         : 12345
 Source Server Type    : MySQL
 Source Server Version : 80023 (8.0.23)
 Source Host           : localhost:3306
 Source Schema         : express-typescript

 Target Server Type    : MySQL
 Target Server Version : 80023 (8.0.23)
 File Encoding         : 65001

 Date: 05/10/2022 10:00:31
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for procedure_error_log
-- ----------------------------
DROP TABLE IF EXISTS `procedure_error_log`;
CREATE TABLE `procedure_error_log`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `procedure_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `message` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `date_created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `username` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `password` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `state` tinyint(1) NULL DEFAULT 3 COMMENT '1 - Locked, 2 - Disabled, 3 - Active',
  `date_updated` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `date_created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uuid`(`uuid` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Procedure structure for create_user
-- ----------------------------
DROP PROCEDURE IF EXISTS `create_user`;
delimiter ;;
CREATE PROCEDURE `create_user`(IN in_username varchar(50), IN in_password varchar(100))
proc:
BEGIN
    declare pass_length int;

    declare exit handler for SQLEXCEPTION BEGIN
        GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE, @errno = MYSQL_ERRNO, @text = MESSAGE_TEXT;
        set @full_error = CONCAT("ERROR ", @errno, " (", @sqlstate, "): ", @text);
        rollback;
        insert into procedure_error_log (procedure_name, message) values ('signup', @full_error);
        select 1 is_error, 'Unexpected error, please contact your administrator.' as message;
    END;

    IF EXISTS(select 1 from user where username = in_username) THEN
        select 1 as is_error, 'Username already in use.' as message;
        leave proc;
    END IF;

--     set pass_length = CHAR_LENGTH(in_password);
-- 
--     IF (pass_length < 8 or pass_length > 14) THEN
--         select 1 as is_error, 'Password length must be between 8 to 14 characters' as message;
--         leave proc;
--     END IF;

    insert into user(uuid, username, password)
    values (UUID(), in_username, in_password);

    select 0 as is_error, 'You have created your account successfully!' as message;

END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for get_users
-- ----------------------------
DROP PROCEDURE IF EXISTS `get_users`;
delimiter ;;
CREATE PROCEDURE `get_users`()
proc:
BEGIN
		
    select * from user;
		

END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for get_user_data
-- ----------------------------
DROP PROCEDURE IF EXISTS `get_user_data`;
delimiter ;;
CREATE PROCEDURE `get_user_data`(IN in_uuid varchar(36))
proc:
BEGIN

    select username from user where uuid = in_uuid;

END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for login_user
-- ----------------------------
DROP PROCEDURE IF EXISTS `login_user`;
delimiter ;;
CREATE PROCEDURE `login_user`(IN in_username varchar(50), IN in_password varchar(50))
proc:
BEGIN
    declare user_id int;
    declare user_state tinyint(1);
    declare user_uuid varchar(36);
		declare v_password varchar(100);
		
    declare exit handler for SQLEXCEPTION BEGIN
        GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE, @errno = MYSQL_ERRNO, @text = MESSAGE_TEXT;
        set @full_error = CONCAT("ERROR ", @errno, " (", @sqlstate, "): ", @text);
        rollback;
        insert into procedure_error_log (procedure_name, message) values ('login', @full_error);
        select 1 is_error, 'Unexpected error, please contact your administrator.' as message;
    END;

    select id, uuid, state, password
    into user_id, user_uuid, user_state, v_password
    from user
    where username = in_username;

    IF (user_id is null) THEN
        select 1 as is_error, 'Incorrect username or password.' as message;
        leave proc;
    END IF;

    IF (user_state = 1) THEN
        select 1 as is_error, 'Your account has been temporarily locked.' as message;
        leave proc;
    ELSEIF (user_state = 2) THEN
        select 1 as is_error, 'Your account has been disabled, please contact support.' as message;
        leave proc;
    END IF;

    select 0                                  as is_error,
           'You have logged in successfully!' as message,
           user_uuid as uuid,
					 v_password as password;

END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for update_password
-- ----------------------------
DROP PROCEDURE IF EXISTS `update_password`;
delimiter ;;
CREATE PROCEDURE `update_password`(IN in_uuid varchar(36), IN in_old_password varchar(20), IN in_new_password varchar(20))
proc:
BEGIN
    declare pass_length int;
    declare user_id int;
    declare user_state tinyint(1);

    declare exit handler for SQLEXCEPTION BEGIN
        GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE, @errno = MYSQL_ERRNO, @text = MESSAGE_TEXT;
        set @full_error = CONCAT("ERROR ", @errno, " (", @sqlstate, "): ", @text);
        rollback;
        insert into procedure_error_log (procedure_name, message) values ('update_password', @full_error);
        select 1 is_error, 'Unexpected error, please contact your administrator.' as message;
    END;

    set pass_length = CHAR_LENGTH(in_new_password);

    IF (pass_length < 8 or pass_length > 14) THEN
        select 1 as is_error, 'Password length must be between 8 to 14 characters.' as message;
        leave proc;
    END IF;

    select id, state
    into user_id, user_state
    from user
    where uuid = in_uuid
      and password = AES_ENCRYPT(in_old_password, MD5(in_old_password));

    IF (user_id is null) THEN
        select 1 as is_error, 'Incorrect old password.' as message;
        leave proc;
    ELSEIF (user_state <> 3) THEN
        select 1 as is_error, 'Invalid request.' as message;
        leave proc;
    END IF;

    IF (in_old_password = in_new_password) THEN
        select 1 as is_error, 'New password must be different from the last one.' as message;
        leave proc;
    END IF;

    update user set password = AES_ENCRYPT(in_new_password, MD5(in_new_password)) where id = user_id;

    select 0 as is_error, 'You have changed password successfully!' as message;

END
;;
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;
