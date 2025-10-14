import { useState, useEffect } from 'react';
import type { FC } from 'react';
import styles from './CreateUserModal.module.css'; // Reutilizamos los estilos del CreateUserModal
import type { Sucursal } from '../../types/sucursal';
import type { Rol } from '../../types/rol';
import type { User, UserUpdate } from '../../types/user';
import { sucursalService } from '../../services/sucursalService';
import { rolService } from '../../services/rolService';
import { userService } from '../../services/userService';

interface EditUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUserUpdated: () => void;
    user: User;
}

export const EditUserModal: FC<EditUserModalProps> = ({ isOpen, onClose, onUserUpdated, user }) => {
    const [formData, setFormData] = useState({
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        password: '', // Campo opcional para edición
        id_sucursal: user.id_sucursal.toString(),
        id_rol: user.id_rol.toString(),
        id_supervisor: user.id_supervisor?.toString() || ''
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

                if (sucursalesRes?.sucursales) {
                    setSucursales(sucursalesRes.sucursales);
                } else {
                    console.error('Respuesta de sucursales inválida:', sucursalesRes);
                    setError('Error: No se pudieron cargar las sucursales');
                }

                if (rolesRes?.roles) {
                    console.log('Roles obtenidos del servidor:', rolesRes.roles);
                    setRoles(rolesRes.roles);
                } else {
                    console.error('Respuesta de roles inválida:', rolesRes);
                    setError('Error: No se pudieron cargar los roles');
                }
            } catch (error) {
                console.error('Error al cargar datos:', error);
                setError('Error al cargar los datos necesarios.');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [isOpen]);

    // Cargar supervisores cuando se selecciona el rol de asistente
    useEffect(() => {
        const loadSupervisores = async () => {
            const rolId = parseInt(formData.id_rol);
            console.log('ID de rol seleccionado:', rolId);

            if (rolId === 0) { // Si es rol asistente
                try {
                    console.log('Cargando supervisores...');
                    const response = await userService.getUsers({
                        activo: true,
                        rol: 1 // Filtrar por rol supervisor (id_rol = 1)
                    });
                    console.log('Supervisores obtenidos:', response.usuarios);
                    setSupervisores(response.usuarios
                        .filter(u => u.id_usuario !== user.id_usuario) // Excluir al usuario actual
                        .map(u => ({
                            id: u.id_usuario,
                            nombre: `${u.nombre} ${u.apellido}`
                        }))
                    );
                } catch (error) {
                    console.error('Error al cargar supervisores:', error);
                }
            } else {
                setSupervisores([]);
            }
        };

        loadSupervisores();
    }, [formData.id_rol, user.id_usuario]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target as HTMLInputElement;
        const { name, value, type, checked } = target;
        console.log(`Actualizando ${name}:`, {
            valor: type === 'checkbox' ? checked : value,
            tipo: type,
            esRol: name === 'id_rol'
        });
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const updateData: UserUpdate = {
                nombre: formData.nombre,
                apellido: formData.apellido,
                email: formData.email,
                id_sucursal: parseInt(formData.id_sucursal),
                id_rol: parseInt(formData.id_rol),
                id_supervisor: formData.id_supervisor ? parseInt(formData.id_supervisor) : undefined
            };

            // Solo incluir password si se ha modificado
            if (formData.password) {
                updateData.password = formData.password;
            }

            await userService.updateUser(user.id_usuario, updateData);
            onUserUpdated();
            onClose();
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            setError('Error al actualizar el usuario');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2 className={styles.modalTitle}>Editar Usuario</h2>
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
                            Contraseña (dejar en blanco para mantener la actual)
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
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

                    {parseInt(formData.id_rol) === 0 && (
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
                                disabled={loading || supervisores.length === 0}
                            >
                                <option value="">
                                    {loading ? 'Cargando supervisores...' :
                                        supervisores.length === 0 ? 'No hay supervisores disponibles' :
                                            'Seleccione un supervisor'}
                                </option>
                                {supervisores.map(supervisor => (
                                    <option key={supervisor.id} value={supervisor.id}>
                                        {supervisor.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

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
                            {loading ? 'Actualizando...' : 'Actualizar Usuario'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};