create user 'admin_user'@'localhost' identified by 'sejin123';
grant all privileges on *.* to 'admin_user'@'localhost';

create database presale;

create table userTB(
    id int(11) not null auto_increment,
    user varchar(20) not null,
    passwd varchar(30) not null,
    name varchar(20) null,
    phone int(20) null,
    email varchar(100) null,
    address varchar(300) null,
    age int(10) null,
    sex varchar(10) null,
    etc varchar(500) null,
    primary key(id));

insert into userTB (user, passwd) values ('admin', 'sejin123');

create table question(
    id int(11) not null auto_increment,
    name varchar(20) not null,
    phone varchar(30) not null,
    quest varchar(200) null,
    primary key(id));

create table content1(
   id int(11) not null auto_increment,
   name varchar(20) null,
   content varchar(1000) null,
   tag varchar(20) null,
   size varchar(20) null,
   primary key(id));

create table content2(
    id int(11) not null auto_increment,
    name varchar(20) null,
    content varchar(1000) null,
    tag varchar(20) null,
    size varchar(20) null,
    primary key(id));

create table content3(
    id int(11) not null auto_increment,
    name varchar(20) null,
    content varchar(1000) null,
    tag varchar(20) null,
    size varchar(20) null,
    primary key(id));

create table content4(
    id int(11) not null auto_increment,
    name varchar(20) null,
    content varchar(1000) null,
    tag varchar(20) null,
    size varchar(20) null,
    primary key(id));

create table content5(
    id int(11) not null auto_increment,
    name varchar(20) null,
    content varchar(1000) null,
    tag varchar(20) null,
    size varchar(20) null,
    primary key(id));

create table content6(
    id int(11) not null auto_increment,
    name varchar(20) null,
    content varchar(1000) null,
    tag varchar(20) null,
    size varchar(20) null,
    primary key(id));

create table content7(
    id int(11) not null auto_increment,
    name varchar(20) null,
    content varchar(1000) null,
    tag varchar(20) null,
    size varchar(20) null,
    primary key(id));

create table content8(
    id int(11) not null auto_increment,
    name varchar(20) null,
    content varchar(1000) null,
    tag varchar(20) null,
    size varchar(20) null,
    primary key(id));