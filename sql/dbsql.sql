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

create table content1(
   id int(11) not null auto_increment,
   name varchar(20) null,
   content varchar(1000) null,
   tag varchar(20) null,
   primary key(id));

create table content2(
    id int(11) not null auto_increment,
    name varchar(20) null,
    content varchar(1000) null,
    tag varchar(20) null,
    primary key(id));

create table content3(
    id int(11) not null auto_increment,
    name varchar(20) null,
    content varchar(1000) null,
    tag varchar(20) null,
    primary key(id));

create table content4(
    id int(11) not null auto_increment,
    name varchar(20) null,
    content varchar(1000) null,
    tag varchar(20) null,
    primary key(id));

create table content5(
    id int(11) not null auto_increment,
    name varchar(20) null,
    content varchar(1000) null,
    tag varchar(20) null,
    primary key(id));

create table content6(
    id int(11) not null auto_increment,
    name varchar(20) null,
    content varchar(1000) null,
    tag varchar(20) null,
    primary key(id));

create table content7(
    id int(11) not null auto_increment,
    name varchar(20) null,
    content varchar(1000) null,
    tag varchar(20) null,
    primary key(id));

create table content8(
    id int(11) not null auto_increment,
    name varchar(20) null,
    content varchar(1000) null,
    tag varchar(20) null,
    primary key(id));


insert into content1 (tag, content, name) values ('H1', '반달섬 마리나 큐브','content1-1');
insert into content1 (tag, content, name) values ('H2', '상담문의 신청시 즉시 답변드립니다.', 'content1-2');
insert into content1 (tag, content, name) values ('H2', '대표번호 1877-7449', 'content1-3');
insert into content1 (tag, content, name) values ('IMG', './images/slide/cont1-1.png,./images/slide/cont1-2.png,./images/slide/cont1-3.png,./images/slide/cont1-4.png,./images/slide/cont1-5.png', 'content1-4');
insert into content1 (tag, content, name) values ('IMG', './images/content1/cont2.png', 'content1-5');
insert into content2 (content, name, tag) values ('사업개요.png','content2-1','IMG');
insert into content3 (content, name, tag) values ('교통0.png','content3','IMG');
insert into content4 (tag, content, name) values ('H1', '고객접수','content4-1');
insert into content4 (tag, content, name) values ('H2', '상담문의 신청시 즉시 답변드립니다.', 'content4-2');
insert into content5 (content, name, tag) values ('평면도A.png','content5','IMG');
insert into content6 (content, name, tag) values ('커뮤니티1.png','content6','IMG');
insert into content7 (content, name, tag) values ('주변입지0.png','content7','IMG');