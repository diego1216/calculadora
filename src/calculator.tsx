import React, { useState } from "react";
import './calculator.css';
// Tipo para matrices de diferentes dimensiones
type Matrix = number[][][] | number[][] | number[];

// Verifica si un valor es un array de arrays
const is2DArray = (value: any): value is number[][] => Array.isArray(value) && Array.isArray(value[0]);

// Verifica si un valor es un array de arrays de arrays
const is3DArray = (value: any): value is number[][][] => Array.isArray(value) && Array.isArray(value[0]) && Array.isArray(value[0][0]);

// Función para sumar matrices
const sumMatrices = (matrix1: Matrix, matrix2: Matrix): Matrix => {
  if (is3DArray(matrix1) && is3DArray(matrix2)) {
    if (matrix1.length !== matrix2.length ||
        matrix1[0].length !== matrix2[0].length ||
        matrix1[0][0].length !== matrix2[0][0].length) {
      throw new Error("Las dimensiones de las matrices tridimensionales no coinciden.");
    }
    return matrix1.map((plane, i) =>
      plane.map((row, j) =>
        row.map((value, k) => value + (matrix2 as number[][][])[i][j][k])
      )
    );
  } else if (is2DArray(matrix1) && is2DArray(matrix2)) {
    if (matrix1.length !== matrix2.length ||
        matrix1[0].length !== matrix2[0].length) {
      throw new Error("Las dimensiones de las matrices bidimensionales no coinciden.");
    }
    return matrix1.map((row, i) =>
      row.map((value, j) => value + (matrix2 as number[][])[i][j])
    );
  } else if (Array.isArray(matrix1) && Array.isArray(matrix2)) {
    if (matrix1.length !== matrix2.length) {
      throw new Error("Las dimensiones de los vectores no coinciden.");
    }
    return (matrix1 as number[]).map((value, i) => value + (matrix2 as number[])[i]);
  } else {
    throw new Error("Tipo de matrices no soportado para la suma.");
  }
};

// Función para restar matrices
const subtractMatrices = (matrix1: Matrix, matrix2: Matrix): Matrix => {
  if (is3DArray(matrix1) && is3DArray(matrix2)) {
    if (matrix1.length !== matrix2.length ||
        matrix1[0].length !== matrix2[0].length ||
        matrix1[0][0].length !== matrix2[0][0].length) {
      throw new Error("Las dimensiones de las matrices tridimensionales no coinciden.");
    }
    return matrix1.map((plane, i) =>
      plane.map((row, j) =>
        row.map((value, k) => value - (matrix2 as number[][][])[i][j][k])
      )
    );
  } else if (is2DArray(matrix1) && is2DArray(matrix2)) {
    if (matrix1.length !== matrix2.length ||
        matrix1[0].length !== matrix2[0].length) {
      throw new Error("Las dimensiones de las matrices bidimensionales no coinciden.");
    }
    return matrix1.map((row, i) =>
      row.map((value, j) => value - (matrix2 as number[][])[i][j])
    );
  } else if (Array.isArray(matrix1) && Array.isArray(matrix2)) {
    if (matrix1.length !== matrix2.length) {
      throw new Error("Las dimensiones de los vectores no coinciden.");
    }
    return (matrix1 as number[]).map((value, i) => value - (matrix2 as number[])[i]);
  } else {
    throw new Error("Tipo de matrices no soportado para la resta.");
  }
};

// Función para multiplicar vectores (unidimensionales)
const multiplyVectors = (vector1: number[], vector2: number[]): number[] => {
  if (vector1.length !== vector2.length) {
    throw new Error("Los vectores deben tener la misma longitud.");
  }
  return vector1.map((value, i) => value * vector2[i]);
};

// Función para multiplicar matrices bidimensionales
const multiplyMatrices = (matrix1: number[][], matrix2: number[][]): number[][] => {
  if (matrix1[0].length !== matrix2.length) {
    throw new Error("Dimensiones incompatibles para la multiplicación bidimensional.");
  }

  const result: number[][] = Array.from({ length: matrix1.length }, () =>
    Array(matrix2[0].length).fill(0)
  );

  for (let i = 0; i < matrix1.length; i++) {
    for (let j = 0; j < matrix2[0].length; j++) {
      for (let k = 0; k < matrix2.length; k++) {
        result[i][j] += matrix1[i][k] * matrix2[k][j];
      }
    }
  }

  return result;
};

// Función para invertir matrices bidimensionales 2x2
const inverseMatrix = (matrix: number[][]): number[][] => {
  if (matrix.length === 2 && matrix[0].length === 2) {
    const det = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    if (det === 0) {
      throw new Error("Matrix is not invertible");
    }
    return [
      [matrix[1][1] / det, -matrix[0][
        1] / det],
        [-matrix[1][0] / det, matrix[0][0] / det],
      ];
    }
    throw new Error("Only 2x2 matrix inversion is supported");
  };
  
  // Función para multiplicar matrices tridimensionales 3x3
  const multiply3DMatrices = (matrix1: number[][][], matrix2: number[][][]): number[][][] => {
    const result: number[][][] = Array.from({ length: 3 }, () =>
      Array.from({ length: 3 }, () =>
        Array(3).fill(0)
      )
    );
  
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        for (let k = 0; k < 3; k++) {
          for (let l = 0; l < 3; l++) {
            result[i][j][k] += matrix1[i][l][k] * matrix2[l][j][k];
          }
        }
      }
    }
  
    return result;
  };
  
  // Componente principal
  const MatrixCalculator: React.FC = () => {
    const [dimension, setDimension] = useState(1);
    const [matrix1, setMatrix1] = useState<Matrix>([]);
    const [matrix2, setMatrix2] = useState<Matrix>([]);
    const [resultMatrix, setResultMatrix] = useState<Matrix | null>(null);
    const [operation, setOperation] = useState<string>("sum");
  
    const handleDimensionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const dim = parseInt(event.target.value);
      setDimension(dim);
      setMatrix1(createEmptyMatrix(dim));
      setMatrix2(createEmptyMatrix(dim));
      setResultMatrix(null); // Resetear resultado
    };
  
    const createEmptyMatrix = (dim: number): Matrix => {
      if (dim === 1) return [0, 0, 0];
      if (dim === 2) return [[0, 0], [0, 0]];
      if (dim === 3) return Array.from({ length: 3 }, () =>
        Array.from({ length: 3 }, () =>
          Array(3).fill(0)
        )
      );
      return [];
    };
  
    const handleMatrixChange = (
      event: React.ChangeEvent<HTMLInputElement>,
      i: number,
      j?: number,
      k?: number,
      isMatrix1 = true
    ) => {
      const value = parseFloat(event.target.value);
      const newMatrix = isMatrix1 ? JSON.parse(JSON.stringify(matrix1)) : JSON.parse(JSON.stringify(matrix2));
  
      if (dimension === 1) {
        (newMatrix as number[])[i] = value;
      } else if (dimension === 2 && j !== undefined) {
        (newMatrix as number[][])[i][j] = value;
      } else if (dimension === 3 && j !== undefined && k !== undefined) {
        (newMatrix as number[][][])[i][j][k] = value;
      }
  
      if (isMatrix1) setMatrix1(newMatrix);
      else setMatrix2(newMatrix);
    };
  
    const handleOperationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const op = event.target.value;
      setOperation(op);
      // Limpiar la segunda matriz si la operación es inversa
      if (op === "inverse" && dimension !== 2) {
        setOperation("sum");
      } else if (op !== "inverse") {
        setMatrix2(createEmptyMatrix(dimension)); // Reestablecer matriz 2 si no es inversa
      }
    };
  
    const handleCalculate = () => {
      let result: Matrix | null = null;
  
      try {
        if (operation === "sum") {
          result = sumMatrices(matrix1, matrix2);
        } else if (operation === "subtract") {
          result = subtractMatrices(matrix1, matrix2);
        } else if (operation === "multiply") {
          if (dimension === 1) {
            result = [multiplyVectors(matrix1 as number[], matrix2 as number[])];
          } else if (dimension === 2) {
            result = multiplyMatrices(matrix1 as number[][], matrix2 as number[][]);
          } else if (dimension === 3) {
            result = multiply3DMatrices(matrix1 as number[][][], matrix2 as number[][][]);
          }
        } else if (operation === "inverse") {
          if (dimension === 2) {
            result = inverseMatrix(matrix1 as number[][]);
          } else {
            throw new Error("La inversión de matrices solo está soportada para matrices bidimensionales 2x2.");
          }
        }
      } catch (error: any) {
        alert(error.message);
      }
  
      setResultMatrix(result);
    };
  
    return (
      <div>
        <label htmlFor="dimension">Dimensión:</label>
        <select id="dimension" value={dimension} onChange={handleDimensionChange}>
          <option value={1}>Unidimensional</option>
          <option value={2}>Bidimensional</option>
          <option value={3}>Tridimensional</option>
        </select>
  
        <label htmlFor="operation">Operación:</label>
        <select id="operation" value={operation} onChange={handleOperationChange}>
          <option value="sum">Suma</option>
          <option value="subtract">Resta</option>
          <option value="multiply">Multiplicación</option>
          {dimension === 2 && <option value="inverse">Inversa</option>}
        </select>
  
        {(operation !== "inverse" && dimension > 0) && (
          <div>
            <h2>Matriz 1</h2>
            {dimension === 1 && (
              <div>
                {[0, 1, 2].map((i) => (
                  <input
                    key={`matrix1-${i}`}
                    type="number"
                    value={(matrix1 as number[])[i] || ""}
                    onChange={(e) => handleMatrixChange(e, i, undefined, undefined, true)}
                  />
                ))}
              </div>
            )}
            {dimension === 2 && (
              <div>
                {[0, 1].map((i) => (
                  <div key={`matrix1-row-${i}`}>
                    {[0, 1].map((j) => (
                      <input
                        key={`matrix1-${i}-${j}`}
                        type="number"
                        value={(matrix1 as number[][])[i][j] || ""}
                        onChange={(e) => handleMatrixChange(e, i, j, undefined, true)}
                      />
                    ))}
                  </div>
                ))}
              </div>
            )}
            {dimension === 3 && (
              <div>
                <div>
                  {[0, 1, 2].map((i) => (
                    <input
                      key={`matrix1-${i}-0-0`}
                      type="number"
                      value={(matrix1 as number[][][])[i][0][0] || ""}
                      onChange={(e) => handleMatrixChange(e, i, 0, 0, true)}
                    />
                  ))}
                </div>
                <div>
                  {[0, 1, 2].map((i) => (
                    <input
                      key={`matrix1-${i}-1-0`}
                      type="number"
                      value={(matrix1 as number[][][])[i][1][0] || ""}
                      onChange={(e) => handleMatrixChange(e, i, 1, 0, true)}
                    />
                  ))}
                </div>
                <div>
                  {[0, 1, 2].map((i) => (
                    <input
                      key={`matrix1-${i}-2-0`}
                      type="number"
                      value={(matrix1 as number[][][])[i][2][0] || ""}
                      onChange={(e) => handleMatrixChange(e, i, 2, 0, true)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
  
        {(operation !== "inverse" && dimension > 0) && (
          <div>
            <h2>Matriz 2</h2>
            {dimension === 1 && (
              <div>
                {[0, 1, 2].map((i) => (
                  <input
                    key={`matrix2-${i}`}
                    type="number"
                    value={(matrix2 as number[])[i] || ""}
                    onChange={(e) => handleMatrixChange(e, i, undefined, undefined, false)}
                  />
                ))}
              </div>
            )}
            {dimension === 2 && (
              <div>
                {[0, 1].map((i) => (
                  <div key={`matrix2-row-${i}`}>
                    {[0, 1].map((j) => (
                      <input
                        key={`matrix2-${i}-${j}`}
                        type="number"
                        value={(matrix2 as number[][])[i][j] || ""}
                        onChange={(e) => handleMatrixChange(e, i, j, undefined, false)}
                      />
                    ))}
                  </div>
                ))}
              </div>
            )}
            {dimension === 3 && (
              <div>
                <div>
                  {[0, 1, 2].map((i) => (
                    <input
                      key={`matrix2-${i}-0-0`}
                      type="number"
                      value={(matrix2 as number[][][])[i][0][0] || ""}
                      onChange={(e) => handleMatrixChange(e, i, 0, 0, false)}
                    />
                  ))}
                </div>
                <div>
                  {[0, 1, 2].map((i) => (
                    <input
                      key={`matrix2-${i}-1-0`}
                      type="number"
                      value={(matrix2 as number[][][])[i][1][0] || ""}
                      onChange={(e) => handleMatrixChange(e, i, 1, 0, false)}
                    />
                  ))}
                </div>
                <div>
                  {[0, 1, 2].map((i) => (
                    <input
                      key={`matrix2-${i}-2-0`}
                      type="number"
                      value={(matrix2 as number[][][])[i][2][0] || ""}
                      onChange={(e) => handleMatrixChange(e, i, 2, 0, false)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
  
        {(operation === "inverse" && dimension === 2) && (
          <div>
            <h2>Matriz 1</h2>
            <div>
              {[0, 1].map((i) => (
                <div key={`matrix1-row-${i}`}>
                  {[0, 1].map((j) => (
                    <input
                      key={`matrix1-${i}-${j}`}
                      type="number"
                      value={(matrix1 as number[][])[i][j] || ""}
                      onChange={(e) => handleMatrixChange(e, i, j, undefined, true)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
  
        <button onClick={handleCalculate}>Calcular</button>
  
        {resultMatrix && (
          <div>
            <h2>Resultado</h2>
            {dimension === 1 && (
              <div>
                {(resultMatrix as number[]).map((value, i) => (
                  <span key={`result-${i}`}>{value} </span>
                ))}
              </div>
            )}
            {dimension === 2 && (
              <div>
                {(resultMatrix as number[][]).map((row, i) => (
                  <div key={`result-row-${i}`}>
                    {row.map((value, j) => (
                      <span key={`result-${i}-${j}`}>{value} </span>
                    ))}
                  </div>
                ))}
              </div>
            )}
            {dimension === 3 && (
              <div>
                {(resultMatrix as number[][][]).map((plane, i) => (
                  <div key={`result-plane-${i}`}>
                    <h3>Plano {i + 1}</h3>
                    {plane.map((row, j) => (
                      <div key={`result-plane-${i}-row-${j}`}>
                        {row.map((value, k) => (
                          <span key={`result-${i}-${j}-${k}`}>{value} </span>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };
  
  export default MatrixCalculator;
  