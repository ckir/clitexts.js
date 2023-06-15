export declare function get_color(name: string): number;
export declare function name_to_rgb(name: string): number;
export declare function xterm_to_rgb(xtermColor: number): number;
export declare function color_from_hex(hex: string): number;
export declare function rgb_to_xterm(rgb: number): number;
export declare function color_from_r_g_b(red: number, green: number, blue: number): number;
export declare function nearest_color(red: number, green: number, blue: number): number;
export declare function nearest_color_cube(red: number, green: number, blue: number): [number, number];
export declare function nearest_gray(red: number, green: number, blue: number): [number, number];
export declare function nearest_ansi(red: number, green: number, blue: number): [number, number];