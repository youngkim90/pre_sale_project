create user 'admin_user'@'localhost' identified by 'sejin123';
grant all privileges on *.* to 'admin_user'@'localhost';

create database presale;

create table userTB(
    id int(11) not null auto_increment,
    name varchar(100) not null,
    phone int(20) not null,
    email varchar(100) null,
    address varchar(300) null,
    age int(10) null,
    sex varchar(10) null,
    etc varchar(500) null,
    primary key(id));