declare module "style-inject" {
    export default function styleInject(css: string, options?: {
        insertAt?: "top";
    }): void;
}
