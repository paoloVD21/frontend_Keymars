--
-- PostgreSQL database dump
--

\restrict MeAGuJ4b5sNL0coKY7MFIxbSXzwXDP7hmB6U4x1oExQiDK0CTxYLmMzCwZ056V0

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: alerta_stock; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.alerta_stock (
    id_alerta integer NOT NULL,
    id_inventario integer NOT NULL,
    fecha_alerta timestamp without time zone DEFAULT now(),
    cantidad_actual numeric(10,2) NOT NULL,
    estado character varying(20) NOT NULL,
    observacion text,
    CONSTRAINT chk_alerta_stock_estado CHECK (((estado)::text = ANY ((ARRAY['creado'::character varying, 'stock_minimo'::character varying, 'stock_bajo'::character varying])::text[])))
);


--
-- Name: alerta_stock_id_alerta_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.alerta_stock_id_alerta_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: alerta_stock_id_alerta_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.alerta_stock_id_alerta_seq OWNED BY public.alerta_stock.id_alerta;


--
-- Name: categoria; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categoria (
    id_categoria integer NOT NULL,
    nombre character varying(100) NOT NULL,
    activo boolean DEFAULT true
);


--
-- Name: categoria_id_categoria_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.categoria_id_categoria_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categoria_id_categoria_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categoria_id_categoria_seq OWNED BY public.categoria.id_categoria;


--
-- Name: inventario; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.inventario (
    id_inventario integer NOT NULL,
    id_ubicacion integer NOT NULL,
    id_producto integer NOT NULL,
    cantidad_actual numeric(10,2) DEFAULT 0 NOT NULL,
    fecha_ultima_actualizacion timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    stock_minimo numeric(10,2) DEFAULT 0
);


--
-- Name: inventario_id_inventario_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.inventario_id_inventario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: inventario_id_inventario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.inventario_id_inventario_seq OWNED BY public.inventario.id_inventario;


--
-- Name: kardex; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.kardex (
    id_kardex integer NOT NULL,
    id_inventario integer NOT NULL,
    tipo_movimiento character varying(10) NOT NULL,
    id_motivo integer NOT NULL,
    cantidad numeric(10,2) NOT NULL,
    cantidad_anterior numeric(10,2) NOT NULL,
    cantidad_nueva numeric(10,2) NOT NULL,
    observacion character varying(500),
    numero_documento character varying(50),
    id_usuario integer NOT NULL,
    fecha_movimiento timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT kardex_tipo_movimiento_check CHECK (((tipo_movimiento)::text = ANY ((ARRAY['INGRESO'::character varying, 'EGRESO'::character varying])::text[])))
);


--
-- Name: kardex_id_kardex_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.kardex_id_kardex_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: kardex_id_kardex_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.kardex_id_kardex_seq OWNED BY public.kardex.id_kardex;


--
-- Name: marca; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.marca (
    id_marca integer NOT NULL,
    nombre character varying(100) NOT NULL,
    activo boolean DEFAULT true
);


--
-- Name: marca_id_marca_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.marca_id_marca_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: marca_id_marca_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.marca_id_marca_seq OWNED BY public.marca.id_marca;


--
-- Name: motivo_movimiento; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.motivo_movimiento (
    id_motivo integer NOT NULL,
    nombre character varying(50) NOT NULL,
    tipo_movimiento character varying(10) NOT NULL,
    activo boolean DEFAULT true,
    tipo_incidencia character varying(50),
    CONSTRAINT motivo_movimiento_tipo_movimiento_check CHECK (((tipo_movimiento)::text = ANY ((ARRAY['INGRESO'::character varying, 'EGRESO'::character varying])::text[])))
);


--
-- Name: motivo_movimiento_id_motivo_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.motivo_movimiento_id_motivo_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: motivo_movimiento_id_motivo_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.motivo_movimiento_id_motivo_seq OWNED BY public.motivo_movimiento.id_motivo;


--
-- Name: movimiento; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.movimiento (
    id_movimiento integer NOT NULL,
    tipo_movimiento character varying(10) NOT NULL,
    id_motivo integer NOT NULL,
    numero_documento character varying(50),
    observacion character varying(500),
    id_usuario integer NOT NULL,
    fecha_movimiento timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    activo boolean DEFAULT true,
    id_sucursal integer,
    CONSTRAINT movimiento_tipo_movimiento_check CHECK (((tipo_movimiento)::text = ANY ((ARRAY['INGRESO'::character varying, 'EGRESO'::character varying])::text[])))
);


--
-- Name: movimiento_detalle; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.movimiento_detalle (
    id_movimiento_detalle integer NOT NULL,
    id_movimiento integer NOT NULL,
    id_inventario integer NOT NULL,
    cantidad numeric(10,2) NOT NULL
);


--
-- Name: movimiento_detalle_id_movimiento_detalle_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.movimiento_detalle_id_movimiento_detalle_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: movimiento_detalle_id_movimiento_detalle_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.movimiento_detalle_id_movimiento_detalle_seq OWNED BY public.movimiento_detalle.id_movimiento_detalle;


--
-- Name: movimiento_id_movimiento_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.movimiento_id_movimiento_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: movimiento_id_movimiento_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.movimiento_id_movimiento_seq OWNED BY public.movimiento.id_movimiento;


--
-- Name: permiso; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.permiso (
    id_permiso integer NOT NULL,
    modulo character varying(50),
    activo boolean DEFAULT true
);


--
-- Name: permiso_id_permiso_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.permiso_id_permiso_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: permiso_id_permiso_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.permiso_id_permiso_seq OWNED BY public.permiso.id_permiso;


--
-- Name: precio_producto; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.precio_producto (
    id_precio integer NOT NULL,
    id_producto integer NOT NULL,
    precio numeric(10,2) NOT NULL,
    fecha_inicio timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_fin timestamp with time zone
);


--
-- Name: precio_producto_id_precio_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.precio_producto_id_precio_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: precio_producto_id_precio_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.precio_producto_id_precio_seq OWNED BY public.precio_producto.id_precio;


--
-- Name: producto; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.producto (
    id_producto integer NOT NULL,
    codigo_producto character varying(50) NOT NULL,
    nombre character varying(200) NOT NULL,
    descripcion text,
    id_categoria integer,
    unidad_medida character varying(10) DEFAULT 'UNIDAD'::character varying,
    fecha_creacion timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    activo boolean DEFAULT true,
    id_marca integer,
    CONSTRAINT producto_unidad_medida_check CHECK (((unidad_medida)::text = ANY ((ARRAY['UNIDAD'::character varying, 'KG'::character varying, 'GRAMO'::character varying, 'LITRO'::character varying, 'ML'::character varying, 'METRO'::character varying, 'CM'::character varying])::text[])))
);


--
-- Name: producto_id_producto_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.producto_id_producto_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: producto_id_producto_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.producto_id_producto_seq OWNED BY public.producto.id_producto;


--
-- Name: producto_proveedor; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.producto_proveedor (
    id_producto integer NOT NULL,
    id_proveedor integer NOT NULL
);


--
-- Name: proveedor; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.proveedor (
    id_proveedor integer NOT NULL,
    nombre character varying(100) NOT NULL,
    contacto character varying(100),
    email character varying(100),
    telefono character varying(20),
    activo boolean DEFAULT true,
    fecha_creacion timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: proveedor_id_proveedor_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.proveedor_id_proveedor_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: proveedor_id_proveedor_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.proveedor_id_proveedor_seq OWNED BY public.proveedor.id_proveedor;


--
-- Name: rol; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rol (
    id_rol integer NOT NULL,
    nombre character varying(50) NOT NULL,
    es_supervisor boolean DEFAULT false,
    activo boolean DEFAULT true
);


--
-- Name: rol_id_rol_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.rol_id_rol_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: rol_id_rol_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.rol_id_rol_seq OWNED BY public.rol.id_rol;


--
-- Name: rol_permiso; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rol_permiso (
    id_rol integer NOT NULL,
    id_permiso integer NOT NULL
);


--
-- Name: sesion_usuario; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sesion_usuario (
    id_sesion uuid DEFAULT gen_random_uuid() NOT NULL,
    id_usuario integer NOT NULL,
    token_sesion character varying(255) NOT NULL,
    fecha_inicio timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_expiracion timestamp with time zone,
    activa boolean DEFAULT true
);


--
-- Name: sucursal; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sucursal (
    id_sucursal integer NOT NULL,
    nombre character varying(100) NOT NULL,
    direccion text,
    fecha_creacion timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    activo boolean DEFAULT true
);


--
-- Name: sucursal_id_sucursal_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sucursal_id_sucursal_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sucursal_id_sucursal_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sucursal_id_sucursal_seq OWNED BY public.sucursal.id_sucursal;


--
-- Name: ubicacion; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ubicacion (
    id_ubicacion integer NOT NULL,
    nombre character varying(100) NOT NULL,
    codigo_ubicacion character varying(20) NOT NULL,
    tipo_ubicacion character varying(20) DEFAULT 'ESTANTERIA'::character varying,
    fecha_creacion timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    activo boolean DEFAULT true,
    id_sucursal integer NOT NULL,
    CONSTRAINT ubicacion_tipo_ubicacion_check CHECK (((tipo_ubicacion)::text = ANY ((ARRAY['ESTANTERIA'::character varying, 'REFRIGERADO'::character varying, 'SECO'::character varying, 'LIQUIDOS'::character varying, 'OTROS'::character varying])::text[])))
);


--
-- Name: ubicacion_id_ubicacion_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ubicacion_id_ubicacion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ubicacion_id_ubicacion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ubicacion_id_ubicacion_seq OWNED BY public.ubicacion.id_ubicacion;


--
-- Name: usuario; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.usuario (
    id_usuario integer NOT NULL,
    nombre character varying(100) NOT NULL,
    apellido character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password_hash character varying(255) NOT NULL,
    id_sucursal integer NOT NULL,
    id_rol integer NOT NULL,
    id_supervisor integer,
    fecha_creacion timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    activo boolean DEFAULT true,
    CONSTRAINT chk_usuario_no_supervisor CHECK ((id_usuario <> id_supervisor))
);


--
-- Name: usuario_id_usuario_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.usuario_id_usuario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: usuario_id_usuario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.usuario_id_usuario_seq OWNED BY public.usuario.id_usuario;


--
-- Name: alerta_stock id_alerta; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alerta_stock ALTER COLUMN id_alerta SET DEFAULT nextval('public.alerta_stock_id_alerta_seq'::regclass);


--
-- Name: categoria id_categoria; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categoria ALTER COLUMN id_categoria SET DEFAULT nextval('public.categoria_id_categoria_seq'::regclass);


--
-- Name: inventario id_inventario; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventario ALTER COLUMN id_inventario SET DEFAULT nextval('public.inventario_id_inventario_seq'::regclass);


--
-- Name: kardex id_kardex; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kardex ALTER COLUMN id_kardex SET DEFAULT nextval('public.kardex_id_kardex_seq'::regclass);


--
-- Name: marca id_marca; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marca ALTER COLUMN id_marca SET DEFAULT nextval('public.marca_id_marca_seq'::regclass);


--
-- Name: motivo_movimiento id_motivo; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.motivo_movimiento ALTER COLUMN id_motivo SET DEFAULT nextval('public.motivo_movimiento_id_motivo_seq'::regclass);


--
-- Name: movimiento id_movimiento; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.movimiento ALTER COLUMN id_movimiento SET DEFAULT nextval('public.movimiento_id_movimiento_seq'::regclass);


--
-- Name: movimiento_detalle id_movimiento_detalle; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.movimiento_detalle ALTER COLUMN id_movimiento_detalle SET DEFAULT nextval('public.movimiento_detalle_id_movimiento_detalle_seq'::regclass);


--
-- Name: permiso id_permiso; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permiso ALTER COLUMN id_permiso SET DEFAULT nextval('public.permiso_id_permiso_seq'::regclass);


--
-- Name: precio_producto id_precio; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.precio_producto ALTER COLUMN id_precio SET DEFAULT nextval('public.precio_producto_id_precio_seq'::regclass);


--
-- Name: producto id_producto; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.producto ALTER COLUMN id_producto SET DEFAULT nextval('public.producto_id_producto_seq'::regclass);


--
-- Name: proveedor id_proveedor; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.proveedor ALTER COLUMN id_proveedor SET DEFAULT nextval('public.proveedor_id_proveedor_seq'::regclass);


--
-- Name: rol id_rol; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rol ALTER COLUMN id_rol SET DEFAULT nextval('public.rol_id_rol_seq'::regclass);


--
-- Name: sucursal id_sucursal; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sucursal ALTER COLUMN id_sucursal SET DEFAULT nextval('public.sucursal_id_sucursal_seq'::regclass);


--
-- Name: ubicacion id_ubicacion; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ubicacion ALTER COLUMN id_ubicacion SET DEFAULT nextval('public.ubicacion_id_ubicacion_seq'::regclass);


--
-- Name: usuario id_usuario; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario ALTER COLUMN id_usuario SET DEFAULT nextval('public.usuario_id_usuario_seq'::regclass);


--
-- Name: alerta_stock alerta_stock_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alerta_stock
    ADD CONSTRAINT alerta_stock_pkey PRIMARY KEY (id_alerta);


--
-- Name: categoria categoria_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categoria
    ADD CONSTRAINT categoria_pkey PRIMARY KEY (id_categoria);


--
-- Name: inventario inventario_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventario
    ADD CONSTRAINT inventario_pkey PRIMARY KEY (id_inventario);


--
-- Name: kardex kardex_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kardex
    ADD CONSTRAINT kardex_pkey PRIMARY KEY (id_kardex);


--
-- Name: marca marca_nombre_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marca
    ADD CONSTRAINT marca_nombre_key UNIQUE (nombre);


--
-- Name: marca marca_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marca
    ADD CONSTRAINT marca_pkey PRIMARY KEY (id_marca);


--
-- Name: motivo_movimiento motivo_movimiento_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.motivo_movimiento
    ADD CONSTRAINT motivo_movimiento_pkey PRIMARY KEY (id_motivo);


--
-- Name: movimiento_detalle movimiento_detalle_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.movimiento_detalle
    ADD CONSTRAINT movimiento_detalle_pkey PRIMARY KEY (id_movimiento_detalle);


--
-- Name: movimiento movimiento_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.movimiento
    ADD CONSTRAINT movimiento_pkey PRIMARY KEY (id_movimiento);


--
-- Name: permiso permiso_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permiso
    ADD CONSTRAINT permiso_pkey PRIMARY KEY (id_permiso);


--
-- Name: producto_proveedor pk_producto_proveedor; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.producto_proveedor
    ADD CONSTRAINT pk_producto_proveedor PRIMARY KEY (id_producto, id_proveedor);


--
-- Name: precio_producto precio_producto_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.precio_producto
    ADD CONSTRAINT precio_producto_pkey PRIMARY KEY (id_precio);


--
-- Name: producto producto_codigo_producto_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.producto
    ADD CONSTRAINT producto_codigo_producto_key UNIQUE (codigo_producto);


--
-- Name: producto producto_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.producto
    ADD CONSTRAINT producto_pkey PRIMARY KEY (id_producto);


--
-- Name: proveedor proveedor_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.proveedor
    ADD CONSTRAINT proveedor_pkey PRIMARY KEY (id_proveedor);


--
-- Name: rol rol_nombre_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rol
    ADD CONSTRAINT rol_nombre_key UNIQUE (nombre);


--
-- Name: rol_permiso rol_permiso_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rol_permiso
    ADD CONSTRAINT rol_permiso_pkey PRIMARY KEY (id_rol, id_permiso);


--
-- Name: rol rol_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rol
    ADD CONSTRAINT rol_pkey PRIMARY KEY (id_rol);


--
-- Name: sesion_usuario sesion_usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sesion_usuario
    ADD CONSTRAINT sesion_usuario_pkey PRIMARY KEY (id_sesion);


--
-- Name: sesion_usuario sesion_usuario_token_sesion_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sesion_usuario
    ADD CONSTRAINT sesion_usuario_token_sesion_key UNIQUE (token_sesion);


--
-- Name: sucursal sucursal_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sucursal
    ADD CONSTRAINT sucursal_pkey PRIMARY KEY (id_sucursal);


--
-- Name: ubicacion ubicacion_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ubicacion
    ADD CONSTRAINT ubicacion_pkey PRIMARY KEY (id_ubicacion);


--
-- Name: ubicacion unique_codigo_sucursal; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ubicacion
    ADD CONSTRAINT unique_codigo_sucursal UNIQUE (id_sucursal, codigo_ubicacion);


--
-- Name: inventario unique_ubicacion_producto; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventario
    ADD CONSTRAINT unique_ubicacion_producto UNIQUE (id_ubicacion, id_producto);


--
-- Name: usuario usuario_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_email_key UNIQUE (email);


--
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id_usuario);


--
-- Name: alerta_stock alerta_stock_id_inventario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alerta_stock
    ADD CONSTRAINT alerta_stock_id_inventario_fkey FOREIGN KEY (id_inventario) REFERENCES public.inventario(id_inventario);


--
-- Name: alerta_stock fk_alerta_inventario; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alerta_stock
    ADD CONSTRAINT fk_alerta_inventario FOREIGN KEY (id_inventario) REFERENCES public.inventario(id_inventario) ON DELETE CASCADE;


--
-- Name: inventario fk_inventario_producto; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventario
    ADD CONSTRAINT fk_inventario_producto FOREIGN KEY (id_producto) REFERENCES public.producto(id_producto);


--
-- Name: inventario fk_inventario_ubicacion; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventario
    ADD CONSTRAINT fk_inventario_ubicacion FOREIGN KEY (id_ubicacion) REFERENCES public.ubicacion(id_ubicacion);


--
-- Name: kardex fk_kardex_inventario; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kardex
    ADD CONSTRAINT fk_kardex_inventario FOREIGN KEY (id_inventario) REFERENCES public.inventario(id_inventario);


--
-- Name: kardex fk_kardex_motivo; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kardex
    ADD CONSTRAINT fk_kardex_motivo FOREIGN KEY (id_motivo) REFERENCES public.motivo_movimiento(id_motivo);


--
-- Name: kardex fk_kardex_usuario; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kardex
    ADD CONSTRAINT fk_kardex_usuario FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario);


--
-- Name: movimiento_detalle fk_mov_det_inv; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.movimiento_detalle
    ADD CONSTRAINT fk_mov_det_inv FOREIGN KEY (id_inventario) REFERENCES public.inventario(id_inventario);


--
-- Name: movimiento_detalle fk_mov_det_mov; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.movimiento_detalle
    ADD CONSTRAINT fk_mov_det_mov FOREIGN KEY (id_movimiento) REFERENCES public.movimiento(id_movimiento);


--
-- Name: movimiento fk_movimiento_motivo; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.movimiento
    ADD CONSTRAINT fk_movimiento_motivo FOREIGN KEY (id_motivo) REFERENCES public.motivo_movimiento(id_motivo);


--
-- Name: movimiento fk_movimiento_sucursal; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.movimiento
    ADD CONSTRAINT fk_movimiento_sucursal FOREIGN KEY (id_sucursal) REFERENCES public.sucursal(id_sucursal);


--
-- Name: movimiento fk_movimiento_usuario; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.movimiento
    ADD CONSTRAINT fk_movimiento_usuario FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario);


--
-- Name: precio_producto fk_precio_producto; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.precio_producto
    ADD CONSTRAINT fk_precio_producto FOREIGN KEY (id_producto) REFERENCES public.producto(id_producto);


--
-- Name: producto_proveedor fk_prod_prov_producto; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.producto_proveedor
    ADD CONSTRAINT fk_prod_prov_producto FOREIGN KEY (id_producto) REFERENCES public.producto(id_producto) ON DELETE CASCADE;


--
-- Name: producto_proveedor fk_prod_prov_proveedor; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.producto_proveedor
    ADD CONSTRAINT fk_prod_prov_proveedor FOREIGN KEY (id_proveedor) REFERENCES public.proveedor(id_proveedor) ON DELETE CASCADE;


--
-- Name: producto fk_producto_categoria; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.producto
    ADD CONSTRAINT fk_producto_categoria FOREIGN KEY (id_categoria) REFERENCES public.categoria(id_categoria);


--
-- Name: producto fk_producto_marca; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.producto
    ADD CONSTRAINT fk_producto_marca FOREIGN KEY (id_marca) REFERENCES public.marca(id_marca);


--
-- Name: rol_permiso fk_rol_permiso_permiso; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rol_permiso
    ADD CONSTRAINT fk_rol_permiso_permiso FOREIGN KEY (id_permiso) REFERENCES public.permiso(id_permiso);


--
-- Name: rol_permiso fk_rol_permiso_rol; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rol_permiso
    ADD CONSTRAINT fk_rol_permiso_rol FOREIGN KEY (id_rol) REFERENCES public.rol(id_rol);


--
-- Name: sesion_usuario fk_sesion_usuario; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sesion_usuario
    ADD CONSTRAINT fk_sesion_usuario FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario);


--
-- Name: usuario fk_usuario_rol; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT fk_usuario_rol FOREIGN KEY (id_rol) REFERENCES public.rol(id_rol);


--
-- Name: usuario fk_usuario_sucursal; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT fk_usuario_sucursal FOREIGN KEY (id_sucursal) REFERENCES public.sucursal(id_sucursal);


--
-- Name: usuario fk_usuario_supervisor; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT fk_usuario_supervisor FOREIGN KEY (id_supervisor) REFERENCES public.usuario(id_usuario);


--
-- Name: ubicacion ubicacion_id_sucursal_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ubicacion
    ADD CONSTRAINT ubicacion_id_sucursal_fkey FOREIGN KEY (id_sucursal) REFERENCES public.sucursal(id_sucursal);


--
-- PostgreSQL database dump complete
--

\unrestrict MeAGuJ4b5sNL0coKY7MFIxbSXzwXDP7hmB6U4x1oExQiDK0CTxYLmMzCwZ056V0

