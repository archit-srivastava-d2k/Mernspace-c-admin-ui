import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LoginPage from "./login";
describe('Login', () => {
    it('should render with requied fields', () => {
        render(<LoginPage  />)
        expect(screen.getByText('Login')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
        expect( screen.getByPlaceholderText('Password')).toBeInTheDocument()
        expect(screen.getByRole('button', {name: 'Login'})).toBeInTheDocument()



    });
});