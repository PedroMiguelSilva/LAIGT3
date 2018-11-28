LAIG Demo Parser

Base code and demo scene provided by:
- Rui Pedro Peixoto Cardoso - up201305469@fe.up.pt
- Diogo da Silva Amaral - up201306082@fe.up.pt

Adapted by:
- Rui Rodrigues - rui.rodrigues@fe.up.pt

# TODO LIST
### (maior importancia para menor importancia)

- torus & textura torus

- refator de setRGB (para que possa ser usada nos materials)
    - uma funçao que recebe node com RGBA e retorna o vetor
    - outra que adicione os elementos à luz

- documentar/comentar as funçoes



- definir valores default para o no da raiz (em vez de ter null ?)
- deteçao de erros no parser e as suas mensagens de erro
    - cada no tem de ter pelo menos um elemtno filho (nao sei se ja esta implementado)
    - dentro da mesma tag nao podem have dois objetos com o mesmo id 
    - todas as tags e atributos sao obrigatorios, exceto onde for referido o contrario
    - raiz tem de existir, assim como o comprimento dos eixos
    - tem de haver pelo menos uma perspetiva
    - tem de haver pelo menos uma luz
    - tem de haver pelo menos uma textura
    - tem de haver pelo menos um material
    - tem de haver pelo menos uma transformaçao, os angulos estao em graus
    - dentro do bloco de uma transformaçao deve haver pelo menos uma transformaçao
    - deve haver pelo menos uma primitiva
    - as tags de primitivas sao limitadas às referidas e nao pode haver mais do que uma por cada tag <primitiva>
    - bloco <transformation> nas components é obrigatorios
    - deve conter uma referencia a uma transformaçao declarada anteriormente ou transformaçoes explicitas (nao necessariamente 1!!!)
    - declaraçao obrigatoria de pelo menos um material em <component>
    - inherit herda material do pai
    - primeiro material é default
    - declaraçao obrigatoria de texture
    - none remove a textura do pai
    - bloco children obrigatorio no <component>
    - deve existir pelo menos um filho
    
    
