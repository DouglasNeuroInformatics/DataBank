create table iris(
  id bigint primary key generated always as identity, 
  created_at timestamptz default now() not null, 
  updated_at timestamptz default now() not null, 
  sepal_length float8 not null, 
  sepal_width float8 not null, 
  petal_length float8 not null, 
  petal_width float8 not null, 
  species varchar(20) not null
);