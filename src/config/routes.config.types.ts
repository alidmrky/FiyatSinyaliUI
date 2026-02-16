import { ReactNode } from 'react';

export interface RouteConfig {
    path: string;
    element: ReactNode;
    menu?: {
        label: string;
        order: number;
    };
    children?: RouteConfig[];
}
