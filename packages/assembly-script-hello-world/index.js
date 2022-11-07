// Glue Code
// https://github.com/torch2424/wasm-by-example/blob/master/demo-util/
export const wasmBrowserInstantiate = async (wasmModuleUrl, importObject) => {
    let response = undefined;

    if (!importObject) {
        importObject = {
            env: {
                abort: () => console.log("Abort!")
            }
        };
    }

    // Check if the browser supports streaming instantiation
    if (WebAssembly.instantiateStreaming) {
        // Fetch the module, and instantiate it as it is downloading
        response = await WebAssembly.instantiateStreaming(
            fetch(wasmModuleUrl),
            importObject
        );
    } else {
        // Fallback to using fetch to download the entire module
        // And then instantiate the module
        const fetchAndInstantiateTask = async () => {
            const wasmArrayBuffer = await fetch(wasmModuleUrl).then(response =>
                response.arrayBuffer()
            );
            return WebAssembly.instantiate(wasmArrayBuffer, importObject);
        };
        response = await fetchAndInstantiateTask();
    }

    return response;
};

// Run our module
const runWasmAdd = async (n1, n2) => {
    // Instantiate our wasm module
    const wasmModule = await wasmBrowserInstantiate("./hello-world.wasm");
    console.log("wasm Module: ", wasmModule);

    // Call the Add function export from wasm, save the result
    const addResult = wasmModule.instance.exports.add(n1, n2);

    // Set the result onto the body
    document.body.textContent = `Hello World! addResult: ${addResult}`;
};
runWasmAdd(1300, 1200);
