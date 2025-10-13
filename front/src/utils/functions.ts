/**
 * Pausa a execução de uma função async por um determinado número de milissegundos.
 * @param ms A quantidade de milissegundos para esperar.
 */
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));