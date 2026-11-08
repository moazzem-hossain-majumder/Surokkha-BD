import os
from PIL import Image

def make_gif():
    base_dir = r"docs\images\readme_dark_showcase"
    
    # Frames sequence for the showcase GIF
    frame_names = [
        "01_home_header_dark.png",
        "02_hazards_catalog_dark.png",
        "03_cyclone_guide_dark.png",
        "06_map_roads_dark.png",
        "07_map_satellite_dark.png",
        "09_shelter_finder_dark.png",
        "12_citizen_report_dark.png",
        "13_relief_needs_dark.png",
        "14_volunteer_hub_dark.png",
        "15_data_explorer_dark.png",
        "17_quiz_player_dark.png",
        "19_lightning_game_dark.png",
        "20_gobag_game_dark.png",
        "04_emergency_contacts_dark.png",
    ]

    images = []
    target_width = 960  # High-definition web preview scale

    for name in frame_names:
        p = os.path.join(base_dir, name)
        if os.path.exists(p):
            im = Image.open(p).convert("RGB")
            # Calculate height preserving aspect ratio
            w, h = im.size
            ratio = target_width / float(w)
            target_height = int(float(h) * float(ratio))
            im_resized = im.resize((target_width, target_height), Image.Resampling.LANCZOS)
            images.append(im_resized)
            print(f"Loaded and scaled {name} -> ({target_width}x{target_height})")

    if not images:
        print("No images found to generate GIF.")
        return

    # Convert to palette with adaptive quantization for crisp rendering and smaller file size
    quantized_images = []
    for im in images:
        # Quantize to 256 colors for GIF
        q = im.convert("P", palette=Image.Palette.ADAPTIVE, colors=256)
        quantized_images.append(q)

    gif_path = os.path.join(base_dir, "surokkha_dark_mode_workflow.gif")
    webp_path = os.path.join(base_dir, "surokkha_dark_mode_workflow.webp")

    print(f"Encoding animated GIF to {gif_path} with {len(quantized_images)} frames...")
    quantized_images[0].save(
        gif_path,
        save_all=True,
        append_images=quantized_images[1:],
        duration=1400,  # 1.4 seconds per frame
        loop=0,
        optimize=True,
    )
    print(f"Animated GIF created: {gif_path} ({os.path.getsize(gif_path)} bytes)")

    print(f"Encoding animated WebP to {webp_path}...")
    images[0].save(
        webp_path,
        save_all=True,
        append_images=images[1:],
        duration=1400,
        loop=0,
        quality=80,
        method=4,
    )
    print(f"Animated WebP created: {webp_path} ({os.path.getsize(webp_path)} bytes)")

if __name__ == "__main__":
    make_gif()

