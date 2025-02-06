import axios from "axios";

export const getCEPInfo = async (cep: string) => {
  try {
    const cleanedCEP = cep.replace(/\D/g, "");
    const response = await axios.get(
      `https://viacep.com.br/ws/${cleanedCEP}/json/`
    );

    if (response.data.erro) {
      throw new Error("CEP não encontrado");
    }

    return response.data;
  } catch (error) {
    throw new Error("Erro ao consultar CEP");
  }
};
