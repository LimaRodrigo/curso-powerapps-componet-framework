/**
 * Calcula a diferença entre duas datas em número de dias.
 * @param {Date} dataMaior - A data mais recente (maior).
 * @param {Date} dataMenor - A data mais antiga (menor).
 * @returns {number} O número de dias de diferença.
 */
export const calcularDiferencaEmDias = (dataMaior: Date, dataMenor: Date): number => {
    // 1. Calcular a diferença em milissegundos
    const diferencaEmMilissegundos = dataMaior.getTime() - dataMenor.getTime();
    // 2. Definir o valor de 1 dia em milissegundos
    const milissegundosPorDia = 1000 * 60 * 60 * 24;
    // 3. Converter a diferença para dias e arredondar
    const diferencaEmDias = Math.floor(diferencaEmMilissegundos / milissegundosPorDia);
    return diferencaEmDias;
}
/**
 * Pausa a execução de uma função assíncrona (async) pelo tempo especificado.
 *
 * @param ms O número de milissegundos para esperar.
 * @returns Uma Promise que resolve após o tempo especificado.
 */
export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retorna uma sub-lista aleatória com um número 'x' de itens da lista original.
 *
 * @param lista A lista de objetos a ser amostrada.
 * @param x O número de itens que a nova lista deve ter.
 * @returns Uma nova lista com 'x' itens selecionados aleatoriamente.
 */
export function obterAmostraAleatoria<T>(lista: T[], x: number): T[] {
    // Validação básica para garantir que 'x' não excede o tamanho da lista
    if (x >= lista.length) {
        // Se 'x' for maior ou igual ao tamanho da lista, retorna uma cópia embaralhada da lista inteira
        console.warn("O número de itens solicitados é maior ou igual ao tamanho da lista. Retornando a lista inteira embaralhada.");
        x = lista.length;
    }

    // Cria uma cópia da lista para não modificar o array original
    const listaCopiada = [...lista];

    // --- Algoritmo de Embaralhamento Fisher-Yates (Shuffle) ---
    // Este algoritmo é eficiente e garante uma distribuição uniforme e aleatória.
    for (let i = listaCopiada.length - 1; i > 0; i--) {
        // Gera um índice aleatório 'j' entre 0 e 'i'
        const j = Math.floor(Math.random() * (i + 1));
        
        // Troca os elementos nos índices 'i' e 'j'
        [listaCopiada[i], listaCopiada[j]] = [listaCopiada[j], listaCopiada[i]];
    }

    // Retorna os primeiros 'x' itens da lista embaralhada
    return listaCopiada.slice(0, x);
}