# YResource Skeleton Maker
This is a personal tool to make frequently made backend skeleton files quickly. It is made with deno and compiled to an executable.

# Compilation
```
deno compile --allow-all --unstable main.ts
```

# Usage
Put the made binary in $PATH. use like this.
```
resource-maker ExamParticipation .
```

This skeleton wil be made in CWD

```
./
-- exam-participation/
---- exam-participation-interfaces.d.ts
---- exam-participation-resource.ts
---- exam-participation-model.ts
---- exam-participation-controller.ts
---- exam-participation-router.ts
```

# TO Do
- Decrease size of the binary
