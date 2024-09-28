# Unified Resource Maker

This is a personal tool to make frequently made backend skeleton files quickly. It is made with deno.


# Usage

You can directly call the script from the github.
```
deno run -A https://raw.githubusercontent.com/yooneskh/unified-resource-maker/refs/heads/master/resource-maker.ts User
```

This skeleton wil be made in CWD

```
./
-- users/
---- mod.ts
```

You can alias this command to use it more easily.

```
alias deno-make-resource="deno run -A https://raw.githubusercontent.com/yooneskh/unified-resource-maker/refs/heads/master/resource-maker.ts"
deno-make-resource User ./domains/ Authentication
```

This will be made.

```
./
-- domains/
---- authentication/
------ users/
-------- mod.ts
```