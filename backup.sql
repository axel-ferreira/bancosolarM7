create table usuarios(
    id serial primary key,
    nombre varchar (50), 
    balance float check (balance >=0)
);

create table transferencias(
    id serial primary key,
    emisor integer, 
    receptor integer,
    monto float,
    fecha timestamp default now(),
    foreign key (emisor) references usuarios (id),
    foreign key (receptor) references usuarios(id)
);

select * from usuarios;