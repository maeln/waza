import vertShaderSrc from './shaders/basic.vert.wgsl?raw';
import fragShaderSrc from './shaders/basic.frag.wgsl?raw';

const positions = new Float32Array([
  1.0, -1.0, 0.0, -1.0, -1.0, 0.0, 0.0, 1.0, 0.0
]);

const indices = new Uint16Array([0, 1, 2]);

const makeBuf = (device: GPUDevice, arr: Float32Array | Uint16Array, usage: number) => {
  const descriptor = {
    size: (arr.byteLength + 3) & ~3,
    usage,
    mappedAtCreation: true,
  };
  const buffer = device.createBuffer(descriptor);
  const writeArray = arr instanceof Uint16Array ? new Uint16Array(buffer.getMappedRange()) : new Float32Array(buffer.getMappedRange());
  writeArray.set(arr);
  buffer.unmap();
  return buffer;
}

class Renderer {
  canvas: HTMLCanvasElement;

  // GPU stuff
  adapter: GPUAdapter;
  device: GPUDevice;
  queue: GPUQueue;
  context: GPUCanvasContext;

  // framebuffer
  fbTexture: GPUTexture;
  fbView: GPUTextureView;

  // buffer
  positionBuffer: GPUBuffer;
  indexBuffer: GPUBuffer;

  // shaders 
  vertModule: GPUShaderModule;
  fragModule: GPUShaderModule;
  ubo: GPUBuffer;

  // pipeline
  bindGroupLayout: GPUBindGroupLayout;
  uniformBindGroup: GPUBindGroup;
  pipeline: GPURenderPipeline;

  public async initApi(): Promise<boolean> {
    try {
      const entry: GPU = navigator.gpu;
      if (!entry) {
        throw new Error('NO WEBGPU');
      }

      this.adapter = await entry.requestAdapter();
      this.device = await this.adapter.requestDevice();
      this.queue = this.device.queue;
    } catch (e) {
      console.error((e));
      return false;
    }
    return true;
  }

  public initCanvas() {
    this.canvas = document.getElementById("gpu") as HTMLCanvasElement;
    if (this.canvas === null) {
      throw new Error('Cant find canvas');
    }

    this.canvas.width = 800;
    this.canvas.height = 600;

    this.context = this.canvas.getContext('webgpu');

    const canvasConfig: GPUCanvasConfiguration = {
      device: this.device,
      format: 'rgba8unorm',
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC,
      alphaMode: "opaque"
    };

    this.context.configure(canvasConfig);
  }

  public setupFramebuffer() {
    this.fbTexture = this.context.getCurrentTexture();
    this.fbView = this.fbTexture.createView();
  }

  public setupVbo() {
    this.positionBuffer = makeBuf(this.device, positions, GPUBufferUsage.VERTEX);
    this.indexBuffer = makeBuf(this.device, indices, GPUBufferUsage.INDEX);
  }

  public setupShaders() {
    this.vertModule = this.device.createShaderModule({ code: vertShaderSrc });
    this.fragModule = this.device.createShaderModule({ code: fragShaderSrc });
    this.ubo = makeBuf(
      this.device,
      new Float32Array([performance.now()]),
      GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    );
  }

  public setupPipeline() {

  }
}

const rdrr: Renderer = new Renderer();
const go = async () => {
  await rdrr.initApi();
  rdrr.initCanvas();
  rdrr.setupFramebuffer();
  rdrr.setupVbo();
  rdrr.setupShaders();
  rdrr.setupPipeline();
}

go();



