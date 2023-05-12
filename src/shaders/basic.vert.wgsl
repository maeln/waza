struct UBO {
  time: f32
};

@group(0) @binding(0)
var<uniform> uniforms: UBO

struct VSOut {
  @builtin(position) Position: vec4f,
};

@vertex
fn main(@location(0) position: vec3f) -> VSOut {
  var vsOut: VSOut;
  vsOut.Position = vec4f(position, 1);
  return vsOut;
}

