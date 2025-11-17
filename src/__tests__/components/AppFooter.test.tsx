import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppFooter } from '../../components/ui/AppFooter';

describe('AppFooter Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Estructura base', () => {
    it('debe renderizar un elemento footer', () => {
      render(<AppFooter />);
      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeTruthy();
    });

    it('debe tener className "footer"', () => {
      const { container } = render(<AppFooter />);
      const footer = container.querySelector('[class*="footer"]');
      expect(footer).toBeTruthy();
    });
  });

  describe('Contenido del footer', () => {
    it('debe mostrar año actual', () => {
      render(<AppFooter />);
      const currentYear = new Date().getFullYear().toString();
      expect(screen.getByText(new RegExp(currentYear))).toBeTruthy();
    });

    it('debe mostrar texto de derechos reservados', () => {
      render(<AppFooter />);
      expect(screen.getByText(/Todos los derechos reservados/)).toBeTruthy();
    });

    it('debe mostrar nombre de empresa "Cao Systems E.I.R.L."', () => {
      render(<AppFooter />);
      expect(screen.getByText(/Cao Systems E\.I\.R\.L\./)).toBeTruthy();
    });
  });

  describe('Props opcionales', () => {
    it('debe aceptar className prop', () => {
      const { container } = render(<AppFooter className="custom-class" />);
      const footerContent = container.querySelector('[class*="footerContent"]');
      expect(footerContent?.classList.contains('custom-class')).toBe(true);
    });

    it('debe renderizarse sin className prop', () => {
      const { container } = render(<AppFooter />);
      const footer = container.querySelector('[class*="footer"]');
      expect(footer).toBeTruthy();
    });

    it('debe permitir className vacío', () => {
      render(<AppFooter className="" />);
      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeTruthy();
    });
  });

  describe('Accesibilidad', () => {
    it('footer debe tener role contentinfo', () => {
      render(<AppFooter />);
      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeTruthy();
    });

    it('texto debe ser legible', () => {
      render(<AppFooter />);
      const text = screen.getByText(/Cao Systems/);
      expect(text.textContent).toBeTruthy();
    });
  });

  describe('Rendering múltiple', () => {
    it('puede renderizarse múltiples veces', () => {
      const { rerender } = render(<AppFooter />);
      expect(screen.getByText(/Todos los derechos reservados/)).toBeTruthy();

      rerender(<AppFooter className="new-class" />);
      expect(screen.getByText(/Todos los derechos reservados/)).toBeTruthy();
    });
  });

  describe('Año dinámico', () => {
    it('debe mostrar el año correcto', () => {
      render(<AppFooter />);
      const year = new Date().getFullYear();
      const footer = screen.getByRole('contentinfo');
      expect(footer.textContent?.includes(year.toString())).toBe(true);
    });

    it('año debe ser número válido', () => {
      render(<AppFooter />);
      const year = new Date().getFullYear();
      expect(Number.isInteger(year)).toBe(true);
      expect(year > 2000).toBe(true);
    });
  });

  describe('Comportamiento sin props', () => {
    it('debe renderizar correctamente sin ninguna prop', () => {
      const { container } = render(<AppFooter />);
      expect(container.firstChild).toBeTruthy();
    });

    it('debe contener todos los textos requeridos', () => {
      render(<AppFooter />);
      expect(screen.getByText(/©/)).toBeTruthy();
      expect(screen.getByText(/Cao Systems E\.I\.R\.L\./)).toBeTruthy();
    });
  });
});
