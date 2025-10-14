import { useState, useEffect } from 'react';
import styles from './CreateUserModal.module.css';
import type { Sucursal } from '../../types/sucursal';
import type { Rol } from '../../types/rol';
import { sucursalService } from '../../services/sucursalService';
import { rolService } from '../../services/rolService';
import { userService } from '../../services/userService';

interface CreateUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUserCreated: () => void;
}

export const CreateUserModal = ({ isOpen, onClose, onUserCreated }: CreateUserModalProps) => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        id_sucursal: '',
        id_rol: '',
        id_supervisor: '',
        activo: true
    });

    const [sucursales, setSucursales] = useState<Sucursal[]>([]);
    const [roles, setRoles] = useState<Rol[]>([]);
    const [supervisores, setSupervisores] = useState<{ id: number; nombre: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadData = async () => {
            if (!isOpen) return;
            
            setLoading(true);
            try {
                console.log('Iniciando carga de datos...');
                const [sucursalesRes, rolesRes] = await Promise.all([
                    sucursalService.getSucursales(),
                    rolService.getRoles()
                ]);

                console.log('Datos recibidos:', { sucursalesRes, rolesRes });
                
                if (sucursalesRes?.sucursales) {
                    setSucursales(sucursalesRes.sucursales);
                } else {
                    console.error('Respuesta de sucursales inválida:', sucursalesRes);
                    setError('Error: No se pudieron cargar las sucursales');
                }

                if (rolesRes?.roles) {
                    setRoles(rolesRes.roles);
                } else {
                    console.error('Respuesta de roles inválida:', rolesRes);
                    setError('Error: No se pudieron cargar los roles');
                }
            } catch (error) {
                console.error('Error al cargar datos:', error);
                setError('Error al cargar los datos necesarios. Por favor, intenta de nuevo.');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [isOpen]);

    // Cargar supervisores cuando se selecciona el rol de asistente
    useEffect(() => {
        const loadSupervisores = async () => {
            if (formData.id_rol === '0') { // Asumiendo que '0' es el ID del rol asistente
                try {
                    // Aquí deberías llamar a un endpoint que devuelva solo los usuarios con rol supervisor
                    const response = await userService.getUsers({ 
                        activo: true,
                        search: 'supervisor' // Asumiendo que el backend filtra por este término
                    });
                    setSupervisores(response.usuarios.map(u => ({
                        id: u.id_usuario,
                        nombre: `${u.nombre} ${u.apellido}`
                    })));
                } catch (error) {
                    console.error('Error al cargar supervisores:', error);
                }
            }
        };

        loadSupervisores();
    }, [formData.id_rol]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
                await userService.createUser({
                ...formData,
                id_sucursal: parseInt(formData.id_sucursal),
                id_rol: parseInt(formData.id_rol),
                id_supervisor: formData.id_supervisor ? parseInt(formData.id_supervisor) : undefined
            });
            onUserCreated();
            onClose();
        } catch (error) {
            console.error('Error al crear usuario:', error);
            setError('Error al crear el usuario');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2 className={styles.modalTitle}>Crear Nuevo Usuario</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="nombre">
                            Nombre
                        </label>
                        <input
                            id="nombre"
                            name="nombre"
                            type="text"
                            required
                            value={formData.nombre}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="apellido">
                            Apellido
                        </label>
                        <input
                            id="apellido"
                            name="apellido"
                            type="text"
                            required
                            value={formData.apellido}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="email">
                            Correo
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="password">
                            Contraseña
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="id_sucursal">
                            Sucursal Asignada
                        </label>
                        <select
                            id="id_sucursal"
                            name="id_sucursal"
                            required
                            value={formData.id_sucursal}
                            onChange={handleChange}
                            className={styles.select}
                            disabled={loading}
                        >
                            <option value="">
                                {loading ? 'Cargando sucursales...' : 'Seleccione una sucursal'}
                            </option>
                            {sucursales?.map(sucursal => (
                                <option key={sucursal.id_sucursal} value={sucursal.id_sucursal}>
                                    {sucursal.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="id_rol">
                            Rol Asignado
                        </label>
                        <select
                            id="id_rol"
                            name="id_rol"
                            required
                            value={formData.id_rol}
                            onChange={handleChange}
                            className={styles.select}
                            disabled={loading}
                        >
                            <option value="">
                                {loading ? 'Cargando roles...' : 'Seleccione un rol'}
                            </option>
                            {roles?.map(rol => (
                                <option key={rol.id_rol} value={rol.id_rol}>
                                    {rol.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    {formData.id_rol === '0' && ( // Mostrar solo si el rol es asistente
                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="id_supervisor">
                                Supervisor Asignado
                            </label>
                            <select
                                id="id_supervisor"
                                name="id_supervisor"
                                required
                                value={formData.id_supervisor}
                                onChange={handleChange}
                                className={styles.select}
                            >
                                <option value="">Seleccione un supervisor</option>
                                {supervisores.map(supervisor => (
                                    <option key={supervisor.id} value={supervisor.id}>
                                        {supervisor.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className={styles.checkboxGroup}>
                        <input
                            id="activo"
                            name="activo"
                            type="checkbox"
                            checked={formData.activo}
                            onChange={handleChange}
                            className={styles.checkbox}
                        />
                        <label className={styles.label} htmlFor="activo">
                            Activo
                        </label>
                    </div>

                    {error && <p className={styles.errorText}>{error}</p>}

                    <div className={styles.buttonGroup}>
                        <button
                            type="button"
                            onClick={onClose}
                            className={`${styles.button} ${styles.cancelButton}`}
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className={`${styles.button} ${styles.submitButton}`}
                            disabled={loading}
                        >
                            {loading ? 'Creando...' : 'Crear Usuario'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};