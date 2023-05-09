module Paleta

open System.Drawing

type Paleta = {
    Nome: string
    Cores: CorPaleta array
}
and CorPaleta = {
    Nome: string
    Cor: Color
}