# AI-ChatBot
 
## Docker hub - Ollama

https://hub.docker.com/r/ollama/ollama

## Docker run Command for Ollama

### Only CPU

´´´bash
docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
´´´


### Nvidia GPU

´´´bash
docker run -d --gpus=all -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
´´´

### AMD GPU

´´´bash
docker run -d --device /dev/kfd --device /dev/dri -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama:rocm
´´´

### Run model locally

´´´bash
docker exec -it ollama ollama run llama3
´´´


