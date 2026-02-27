export type credentials = {
    email: string,
    password: string
}

export type User = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: string;
    role: string;
    tenant?: Tenant
};


export type Tenant = {
    id: number;
    name: string;
    address: string;
};

export type CreateUserData = {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    role: string;
    tenantId: number;
};


export type FieldData = {
    name: string[];
    value?: string;
};

export type PriceConfiguration = {
    [key: string]: {
        priceType: 'base' | 'additional';
        availableOptions: { [key: string]: number };
    };
};

export type AttributeValue = {
    name: string;
    value: string | boolean;
};

export type Category = {
    _id: string;
    name: string;
    priceConfiguration: {
        [key: string]: {
            priceType: 'base' | 'additional';
            availableOptions: string[];
        };
    };
    attributes: {
        name: string;
        widgetType: 'switch' | 'radio';
        defaultValue: string;
        availableOptions: string[];
    }[];
};

export type Product = {
    _id: string;
    name: string;
    description: string;
    image: string;
    priceConfiguration: PriceConfiguration;
    attributes: AttributeValue[];
    tenantId: string;
    categoryId: string;
    isPublish: boolean;
    createdAt: string;
};

export type CreateProductData = {
    name: string;
    description: string;
    image: File;
    priceConfiguration: string;
    attributes: string;
    tenantId: string;
    categoryId: string;
    isPublish: boolean;
};