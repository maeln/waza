struct UBO {
  time: f32
};

@group(0) @binding(0)
var<uniform> uniforms: UBO

@fragment
fn main() -> @location(0) vec4f {
  return vec4f(abs(sin(uniforms.time)), abs(cos(uniforms.time)), abs(cos(uniforms.time)), 1);
}

