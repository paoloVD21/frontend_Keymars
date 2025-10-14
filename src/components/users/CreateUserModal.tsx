import { useState, useEffect } from 'react';
import styles from './CreateUserModal.module.css';
import type { Sucursal } from '../../types/sucursal';
import { sucursalService } from '../../services/sucursalService';
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
        id_supervisor: '',
        activo: true,
        id_rol: '0' // Siempre será rol asistente
    });

    const [sucursales, setSucursales] = useState<Sucursal[]>([]);
    const [supervisores, setSupervisores] = useState<{ id: number; nombre: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadData = async () => {
            if (!isOpen) return;
            
            setLoading(true);
            try {
                // Cargar sucursales y supervisores en paralelo
                const [sucursalesRes, supervisoresRes] = await Promise.all([
                    sucursalService.getSucursales(),
                    userService.getUsers({ 
                        activo: true,
                        rol: 1 // Filtrar por rol supervisor (id_rol = 1)
                    })
                ]);
                
                if (sucursalesRes?.sucursales) {
                    setSucursales(sucursalesRes.sucursales);
                } else {
                    console.error('Respuesta de sucursales inválida:', sucursalesRes);
                    setError('Error: No se pudieron cargar las sucursales');
                }

                // Procesar supervisores
                setSupervisores(supervisoresRes.usuarios.map(u => ({
                    id: u.id_usuario,
                    nombre: `${u.nombre} ${u.apellido}`
                })));
                
            } catch (error) {
                console.error('Error al cargar datos:', error);
                setError('Error al cargar los datos necesarios. Por favor, intenta de nuevo.');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const resetForm = () => {
        setFormData({
            nombre: '',
            apellido: '',
            email: '',
            password: '',
            id_sucursal: '',
            id_rol: '0', // Siempre asistente
            id_supervisor: '',
            activo: true
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await userService.createUser({
                ...formData,
                id_sucursal: parseInt(formData.id_sucursal),
                id_rol: 0, // Siempre asistente
                id_supervisor: formData.id_supervisor ? parseInt(formData.id_supervisor) : undefined,
                activo: formData.activo // Asegurar que se envía el estado activo
            });
            onUserCreated();
            resetForm(); // Reseteamos el formulario después de crear exitosamente
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
                            disabled={loading}
                        >
                            <option value="">
                                {loading ? 'Cargando supervisores...' : 'Seleccione un supervisor'}
                            </option>
                            {supervisores.map(supervisor => (
                                <option key={supervisor.id} value={supervisor.id}>
                                    {supervisor.nombre}
                                </option>
                            ))}
                        </select>
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