#!/usr/bin/env python3
"""
Radiolarian SEM Image Identification Script
放射虫 SEM 图像识别脚本

Usage:
    python identify_radiolarian.py --image ./samples/SEM_001.jpg --detailed
    python identify_radiolarian.py --image ./samples/SEM_001.jpg --level genus --language en
"""

import argparse
import base64
import json
import os
import sys
from pathlib import Path
from datetime import datetime

try:
    from openai import OpenAI
except ImportError:
    print("Error: openai package not installed. Run: pip install openai")
    sys.exit(1)


# System prompt for radiolarian expert
SYSTEM_PROMPT = """You are RadioClaw, a world-class radiolarian (Radiolaria) paleontology expert AI assistant.

You specialize in:
- Identifying radiolarian species from SEM/microscope images
- Describing skeletal structures (latticed shell, conical shape, spiny processes, medullary shell, cortical shell)
- Providing taxonomic suggestions at order, family, genus, and species levels
- Estimating stratigraphic ranges and biochronology
- Paleoceanography and siliceous deposition knowledge

Communication style:
- Professional but humorous
- Concise and direct
- Use 🦞 and 🦠 emojis
- Bilingual terminology (Chinese + English)

IMPORTANT: Only answer radiolaria-related questions. Politely redirect non-radiolaria questions back to radiolaria research.

When analyzing images:
1. Describe morphological features systematically
2. Provide taxonomic suggestions with confidence levels
3. Include stratigraphic range information
4. Give practical recommendations for further analysis
"""


def encode_image_to_base64(image_path: str) -> str:
    """Encode image to base64 string"""
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")


def analyze_radiolarian_image(
    image_path: str,
    api_key: str = None,
    model: str = "gpt-4o",
    detailed: bool = False,
    level: str = "genus",
    language: str = "zh-CN",
    max_tokens: int = 2000,
) -> dict:
    """
    Analyze radiolarian SEM image
    
    Args:
        image_path: Path to the SEM/microscope image
        api_key: OpenAI API key (or set OPENAI_API_KEY env var)
        model: OpenAI model to use
        detailed: Whether to provide detailed analysis
        level: Taxonomic level (order/family/genus/species)
        language: Output language (zh-CN/en)
        max_tokens: Maximum tokens in response
    
    Returns:
        Analysis results dictionary
    """
    api_key = api_key or os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OpenAI API key required. Set OPENAI_API_KEY env var or pass api_key parameter.")
    
    client = OpenAI(api_key=api_key)
    
    # Encode image
    base64_image = encode_image_to_base64(image_path)
    
    # Build prompt based on language and detail level
    if language == "zh-CN":
        detailed_line = "5. 请提供非常详细的分析，包括测量数据和对比文献。" if detailed else ""
        level_line = f"请重点分析到{level}级分类。" if level else ""
        prompt = f"""请分析这张放射虫 SEM/显微照片。

要求：
1. 详细描述形态特征（外壳类型、形状、表面装饰、内部结构）
2. 提供分类建议（目、科、属、种）及置信度
3. 给出地层范围和生物带信息
4. 提供进一步分析的建议
{detailed_line}
{level_line}

图像路径：{image_path}
"""
    else:
        detailed_line = "5. Please provide a very detailed analysis including measurements and literature references." if detailed else ""
        level_line = f"Focus on {level} level taxonomy." if level else ""
        prompt = f"""Please analyze this radiolarian SEM/microscope image.

Requirements:
1. Describe morphological features in detail (shell type, shape, ornamentation, internal structure)
2. Provide taxonomic suggestions (order, family, genus, species) with confidence levels
3. Include stratigraphic range and biozone information
4. Give recommendations for further analysis
{detailed_line}
{level_line}

Image path: {image_path}
"""
    
    # Call OpenAI Vision API
    response = client.chat.completions.create(
        model=model,
        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": prompt
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}"
                        }
                    }
                ]
            }
        ],
        max_tokens=max_tokens,
    )
    
    # Parse response
    analysis_text = response.choices[0].message.content
    
    # Build result dictionary
    result = {
        "image": str(image_path),
        "timestamp": datetime.now().isoformat(),
        "model": model,
        "language": language,
        "detailed": detailed,
        "taxonomic_level": level,
        "analysis": analysis_text,
        "usage": {
            "prompt_tokens": response.usage.prompt_tokens,
            "completion_tokens": response.usage.completion_tokens,
            "total_tokens": response.usage.total_tokens
        }
    }
    
    return result


def main():
    parser = argparse.ArgumentParser(
        description="🦠 Radiolarian SEM Image Identification / 放射虫 SEM 图像识别",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python identify_radiolarian.py --image ./samples/SEM_001.jpg
  python identify_radiolarian.py --image ./samples/SEM_001.jpg --detailed --level genus
  python identify_radiolarian.py --image ./samples/SEM_001.jpg --language en --output result.json
        """
    )
    
    parser.add_argument(
        "--image", "-i",
        required=True,
        help="Path to SEM/microscope image file"
    )
    
    parser.add_argument(
        "--output", "-o",
        help="Output file path (JSON format, default: stdout)"
    )
    
    parser.add_argument(
        "--api-key",
        help="OpenAI API key (default: OPENAI_API_KEY env var)"
    )
    
    parser.add_argument(
        "--model", "-m",
        default="gpt-4o",
        help="OpenAI model to use (default: gpt-4o)"
    )
    
    parser.add_argument(
        "--detailed", "-d",
        action="store_true",
        help="Enable detailed analysis mode"
    )
    
    parser.add_argument(
        "--level", "-l",
        choices=["order", "family", "genus", "species"],
        default="genus",
        help="Taxonomic analysis level (default: genus)"
    )
    
    parser.add_argument(
        "--language",
        choices=["zh-CN", "en"],
        default="zh-CN",
        help="Output language (default: zh-CN)"
    )
    
    parser.add_argument(
        "--max-tokens",
        type=int,
        default=2000,
        help="Maximum tokens in response (default: 2000)"
    )
    
    args = parser.parse_args()
    
    # Validate image file
    if not os.path.exists(args.image):
        print(f"Error: Image file not found: {args.image}")
        sys.exit(1)
    
    try:
        # Run analysis
        print(f"🦠 Analyzing radiolarian image: {args.image}")
        print(f"🔬 Model: {args.model}")
        print(f"📊 Analysis level: {args.level}")
        print(f"🌐 Language: {args.language}")
        print()
        
        result = analyze_radiolarian_image(
            image_path=args.image,
            api_key=args.api_key,
            model=args.model,
            detailed=args.detailed,
            level=args.level,
            language=args.language,
            max_tokens=args.max_tokens,
        )
        
        # Output results
        if args.output:
            # Save to file
            output_path = Path(args.output)
            output_path.parent.mkdir(parents=True, exist_ok=True)
            with open(output_path, "w", encoding="utf-8") as f:
                json.dump(result, f, ensure_ascii=False, indent=2)
            print(f"✅ Results saved to: {args.output}")
        else:
            # Print to stdout
            print("=" * 60)
            print(result["analysis"])
            print("=" * 60)
            print(f"\n📊 Token usage: {result['usage']['total_tokens']} total")

        # Print MEDIA line for RadioClaw integration (always print for attachment)
        print(f"\nMEDIA: {args.output if args.output else 'stdout'}")
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        sys.exit(1)


if __name__ == "__main__":
    main()
