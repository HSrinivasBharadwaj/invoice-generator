interface ValidationResult {
    isValid: boolean;
    errors: string[]
}

interface SignUpData {
    email: string;
    password: string;
    name?: string;
    companyName?: string;
    companyAddress?: string;
    logoUrl?: string;
    companyPhone?: string
}

interface ClientData {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    taxNumber?: string;
    notes?: string;
}


/**
 * @param data - signup form data
 * @returns Validation result with errors array
 */

export const ValidateSignUpData = (data: SignUpData): ValidationResult => {
    const errors: string[] = [];
    const { email, password, name, companyName, companyAddress, logoUrl, companyPhone } = data
    //Email Validation
    if (!email || typeof email !== 'string') {
        errors.push('Email is required');
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            errors.push('Invalid email format');
        }
    }
    // Password validation (min 8 chars)
    if (!password || typeof password !== 'string') {
        errors.push('Password is required');
    } else if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }
    if (name !== undefined && name !== null) {
        if (typeof name !== 'string' || name.trim().length === 0) {
            errors.push('Name cannot be empty if provided');
        } else if (name.trim().length < 2) {
            errors.push('Name must be at least 2 characters long');
        } else if (name.trim().length > 100) {
            errors.push('Name must be less than 100 characters');
        }
    }
    // Company name validation (optional, but if provided should be valid)
    if (companyName !== undefined && companyName !== null) {
        if (typeof companyName !== 'string' || companyName.trim().length === 0) {
            errors.push('Company name cannot be empty if provided');
        } else if (companyName.trim().length < 2) {
            errors.push('Company name must be at least 2 characters long');
        } else if (companyName.trim().length > 200) {
            errors.push('Company name must be less than 200 characters');
        }
    }
    // Company address validation (optional, but if provided should be valid)
    if (companyAddress !== undefined && companyAddress !== null) {
        if (typeof companyAddress !== 'string' || companyAddress.trim().length === 0) {
            errors.push('Company address cannot be empty if provided');
        } else if (companyAddress.trim().length < 5) {
            errors.push('Company address must be at least 5 characters long');
        } else if (companyAddress.trim().length > 500) {
            errors.push('Company address must be less than 500 characters');
        }
    }
    // Phone validation (optional)
    if (companyPhone) {
        const phoneRegex = /^[+]?[\d\s-]{10,15}$/;
        if (!phoneRegex.test(companyPhone)) {
            errors.push('Invalid phone number format');
        }
    }

    // Company logo URL validation (optional)
    if (logoUrl !== undefined && logoUrl !== null) {
        if (typeof logoUrl !== 'string' || logoUrl.trim().length === 0) {
            errors.push('Company logo URL cannot be empty if provided');
        } else {
            // Basic URL validation
            const urlRegex = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;
            if (!urlRegex.test(logoUrl.trim())) {
                errors.push('Invalid company logo URL format');
            }
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    };

}

/**
 * @param data - Login form data
 * @returns Validation result with errors array
 */

export const ValidateLoginData = (data: { email: string, password: string }): ValidationResult => {
    const errors: string[] = [];
    const { email, password } = data;
    //Email Validation
    if (!email || typeof email !== 'string') {
        errors.push('Email is required');
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            errors.push('Invalid email format');
        }
    }
    // Password validation
    if (!password || typeof password !== 'string') {
        errors.push('Password is required');
    }
    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Sanitize string input (trim and remove extra spaces)
 * @param input - String to sanitize
 * @returns Sanitized string or null
 */

export const sanitizeString = (input?: string): string | null => {
    if (!input) return null;
    return input.trim().replace(/\s+/g, ' ');
}

/**
 * Validate client data
 * @param data - Client form data
 * @returns Validation result with errors array
 */
export const ValidateClientData = (data: ClientData): ValidationResult => {
    const errors: string[] = [];
    const { name, email, phone, address, city, state, zipCode, country, taxNumber, notes } = data;

    // Name validation (REQUIRED)
    if (!name || typeof name !== 'string') {
        errors.push('Client name is required');
    } else if (name.trim().length === 0) {
        errors.push('Client name cannot be empty');
    } else if (name.trim().length < 2) {
        errors.push('Client name must be at least 2 characters long');
    } else if (name.trim().length > 200) {
        errors.push('Client name must be less than 200 characters');
    }

    // Email validation (optional, but if provided should be valid)
    if (email !== undefined && email !== null && email.trim().length > 0) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            errors.push('Invalid email format');
        }
    }

    // Phone validation (optional)
    if (phone !== undefined && phone !== null && phone.trim().length > 0) {
        const phoneRegex = /^[+]?[\d\s-]{10,15}$/;
        if (!phoneRegex.test(phone)) {
            errors.push('Invalid phone number format');
        }
    }

    // Address validation (optional)
    if (address !== undefined && address !== null && address.trim().length > 0) {
        if (address.trim().length < 5) {
            errors.push('Address must be at least 5 characters long');
        } else if (address.trim().length > 500) {
            errors.push('Address must be less than 500 characters');
        }
    }

    // City validation (optional)
    if (city !== undefined && city !== null && city.trim().length > 0) {
        if (city.trim().length < 2) {
            errors.push('City must be at least 2 characters long');
        } else if (city.trim().length > 100) {
            errors.push('City must be less than 100 characters');
        }
    }

    // State validation (optional)
    if (state !== undefined && state !== null && state.trim().length > 0) {
        if (state.trim().length < 2) {
            errors.push('State must be at least 2 characters long');
        } else if (state.trim().length > 100) {
            errors.push('State must be less than 100 characters');
        }
    }

    // Zip code validation (optional)
    if (zipCode !== undefined && zipCode !== null && zipCode.trim().length > 0) {
        if (zipCode.trim().length < 3) {
            errors.push('Zip code must be at least 3 characters long');
        } else if (zipCode.trim().length > 20) {
            errors.push('Zip code must be less than 20 characters');
        }
    }

    // Country validation (optional)
    if (country !== undefined && country !== null && country.trim().length > 0) {
        if (country.trim().length < 2) {
            errors.push('Country must be at least 2 characters long');
        } else if (country.trim().length > 100) {
            errors.push('Country must be less than 100 characters');
        }
    }

    // Tax number validation (optional)
    if (taxNumber !== undefined && taxNumber !== null && taxNumber.trim().length > 0) {
        if (taxNumber.trim().length < 5) {
            errors.push('Tax number must be at least 5 characters long');
        } else if (taxNumber.trim().length > 50) {
            errors.push('Tax number must be less than 50 characters');
        }
    }

    // Notes validation (optional)
    if (notes !== undefined && notes !== null && notes.trim().length > 0) {
        if (notes.trim().length > 1000) {
            errors.push('Notes must be less than 1000 characters');
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};