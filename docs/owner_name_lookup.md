# Zoho Function Enhancement Guide

## Problema
O Zoho COQL retorna apenas `{id: "..."}` para campos de lookup como `Owner`, sem incluir o nome do usuário.

## Soluções Possíveis

### ✅ Solução 1: Atualizar a Zoho Function (RECOMENDADO)

Atualizar a função Zoho para fazer o lookup automático dos nomes dos Users.

**Vantagens:**
- ✅ Automático - não precisa manutenção manual
- ✅ Sempre atualizado com os dados do Zoho
- ✅ Funciona para todos os gestores automaticamente

**Como implementar:**
1. Abra **Zoho CRM** > **Setup** > **Developer Space** > **Functions**
2. Encontre a função COQL que você está usando
3. Substitua o código pela versão em `docs/zoho_function_enhanced.deluge`
4. Salve e teste a função
5. Reinicie o servidor node (`npm run dev`)

O arquivo `zoho_function_enhanced.deluge` contém o código Deluge completo.

---

### ⚠️ Solução 2: Mapeamento Manual (ATUAL)

Manter um mapeamento manual de IDs para nomes no arquivo `src/config/ownerMapping.ts`.

**Vantagens:**
- ✅ Implementação imediata
- ✅ Não requer mudanças no Zoho

**Desvantagens:**
- ❌ Precisa atualizar manualmente quando adicionar novos gestores
- ❌ Nomes podem ficar desatualizados

**Como usar:**
1. Abra `src/config/ownerMapping.ts`
2. Preencha o objeto `OWNER_NAMES`:
   ```typescript
   export const OWNER_NAMES: Record<string, string> = {
       '829550000011590001': 'Dr. Leo',
       '829550000000589195': 'Eliane Almeida',
       '829550000002140001': 'Felipe Valentin',
       '829550000000589019': 'Nicaela Cabral',
   };
   ```
3. Reinicie o servidor

---

### ❌ Solução 3: COQL JOIN (NÃO DISPONÍVEL)

Zoho COQL **não suporta**:
- ❌ JOINs entre módulos
- ❌ Notação de ponto para acessar campos relacionados (`Owner.name`)
- ❌ Subqueries

---

## Recomendação Final

**Use a Solução 1** (Enhanced Zoho Function) para ter uma solução robusta e automatizada.

Se não conseguir atualizar a função Zoho agora, use a **Solução 2** (Mapeamento Manual) como solução temporária.
