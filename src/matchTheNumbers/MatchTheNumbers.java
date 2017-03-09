package matchTheNumbers;

import java.awt.Color;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Toolkit;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.awt.event.WindowEvent;
import java.awt.event.WindowFocusListener;
import java.io.File;
import java.io.FileNotFoundException;
import java.util.Random;
import java.util.Scanner;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JTextArea;
import javax.swing.SwingUtilities;

public class MatchTheNumbers {

    private static JFrame frame;
    private static int newX = 0;
    private static int newY = 0;
    private static boolean pause = false;
    private static boolean show = false;

    public static void main(String[] args) throws InterruptedException {
        String title = "MatchTheNumbers";
        Dimension dimension = Toolkit.getDefaultToolkit().getScreenSize();
        int[] dimensions = {(int) dimension.getWidth(), (int) dimension.getHeight()};
        Scanner input = null;
        try {
            input = new Scanner(new File("MatchTheNumbersConfiguration.ini"));
        }
        catch (FileNotFoundException ex) {
            JOptionPane.showMessageDialog(null, ex, title, JOptionPane.ERROR_MESSAGE);
            return;
        }
        int labelSize = input.nextInt();
        input.nextLine();
        Font font = new Font(Font.MONOSPACED, Font.BOLD, labelSize);
        FontMetrics fontMetrics = new JLabel().getFontMetrics(font);
        String[] horOptions = makeOptions(dimensions[0] / fontMetrics.charWidth('0'));
        int charactersHor = Integer.parseInt((String) JOptionPane.showInputDialog(null, "Choose the number of the horizontal characters.",
                title, JOptionPane.QUESTION_MESSAGE, null, horOptions, horOptions[horOptions.length - 1]));
        String[] verOptions = makeOptions(dimensions[1] / fontMetrics.getHeight());
        int charactersVer = Integer.parseInt((String) JOptionPane.showInputDialog(null, "Choose the number of the vertical characters.",
                title, JOptionPane.QUESTION_MESSAGE, null, verOptions, verOptions[verOptions.length - 1]));
        boolean gameType = input.nextInt() == 0;
        input.nextLine();
        int minDigit = input.nextInt();
        input.nextLine();
        int maxDigit = input.nextInt();
        input.nextLine();
        boolean moveType = input.nextInt() == 0;
        input.nextLine();
        int framesPerSecond = input.nextInt();
        input.nextLine();
        int character = input.nextInt();
        input.nextLine();
        int letter = input.nextInt();
        input.nextLine();
        boolean color = input.nextInt() == 0;
        input.close();
        Random random = new Random();
        frame = new JFrame(title);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setLayout(new GridBagLayout());
        GridBagConstraints gridBagConstraints;
        JLabel[][] labels = new JLabel[charactersVer][charactersHor];
        for (int i = 0; i < charactersVer; i++) {
            for (int j = 0; j < charactersHor; j++) {
                labels[i][j] = new JLabel("0");
                labels[i][j].setFont(font);
                gridBagConstraints = new GridBagConstraints();
                gridBagConstraints.gridx = j;
                gridBagConstraints.gridy = i;
                gridBagConstraints.weightx = 1;
                gridBagConstraints.weighty = 1;
                frame.add(labels[i][j], gridBagConstraints);
            }
        }
        SwingUtilities.invokeLater(new Runnable() {
            @Override
            public void run() {
                frame.pack();
                frame.setLocationRelativeTo(null);
                frame.setVisible(true);
            }
        });
        char[][] characters = new char[charactersVer][charactersHor];
        if (!gameType) {
            for (int i = 0; i < charactersVer; i++) {
                for (int j = 0; j < charactersHor; j++) {
                    characters[i][j] = (char) (random.nextInt(maxDigit - minDigit + 1) + minDigit + '0');
                    labels[i][j].setText("" + characters[i][j]);
                    labels[i][j].setForeground(Color.BLACK);
                }
            }
            labels[0][0].setForeground(Color.RED);
            frame.addKeyListener(new KeyAdapter() {
                @Override
                public void keyPressed(KeyEvent e) {
                    int keyCode = e.getKeyCode(), oldX = newX, oldY = newY;
                    boolean change = false;
                    if (keyCode == KeyEvent.VK_UP && newY != 0) {
                        newY--;
                        change = true;
                    }
                    if (keyCode == KeyEvent.VK_DOWN && newY != charactersVer - 1) {
                        newY++;
                        change = true;
                    }
                    if (keyCode == KeyEvent.VK_LEFT && newX != 0) {
                        newX--;
                        change = true;
                    }
                    if (keyCode == KeyEvent.VK_RIGHT && newX != charactersHor - 1) {
                        newX++;
                        change = true;
                    }
                    if (change) {
                        if (moveType) {
                            if (characters[oldY][oldX] == maxDigit + '0') {
                                characters[oldY][oldX] = (char) ('0' + minDigit);
                            }
                            else {
                                characters[oldY][oldX]++;
                            }
                            labels[oldY][oldX].setText("" + characters[oldY][oldX]);
                        }
                        else {
                            if (characters[newY][newX] == maxDigit + '0') {
                                characters[newY][newX] = (char) ('0' + minDigit);
                            }
                            else {
                                characters[newY][newX]++;
                            }
                            labels[newY][newX].setText("" + characters[newY][newX]);
                        }
                        labels[oldY][oldX].setForeground(Color.BLACK);
                        labels[newY][newX].setForeground(Color.RED);
                        for (int i = 0; i < charactersVer; i++) {
                            for (int j = 0; j < charactersHor; j++) {
                                if (characters[i][j] != maxDigit + '0') {
                                    return;
                                }
                            }
                        }
                        frame.dispose();
                        JOptionPane.showMessageDialog(null, "Congratulations, you finished!", title, JOptionPane.INFORMATION_MESSAGE);
                    }
                }
            });
        }
        else {
            frame.addWindowFocusListener(new WindowFocusListener() {
                @Override
                public void windowGainedFocus(WindowEvent e) {
                    pause = false;
                }

                @Override
                public void windowLostFocus(WindowEvent e) {
                    pause = true;
                }
            });
            frame.addKeyListener(new KeyAdapter() {
                @Override
                public void keyPressed(KeyEvent e) {
                    if (e.getKeyCode() == KeyEvent.VK_P) {
                        show = true;
                    }
                }
            });
            long start = System.nanoTime();
            while (true) {
                for (int i = 0; i < characters.length; i++) {
                    for (int j = 0; j < characters[0].length; j++) {
                        int type = random.nextInt(2);
                        if (character == 0 || (character == 2 && type == 0)) {
                            characters[i][j] = (char) (random.nextInt(10) + 48);
                        }
                        if (character == 1 || (character == 2 && type == 1)) {
                            type = random.nextInt(2);
                            if (letter == 0 || (letter == 2 && type == 0)) {
                                characters[i][j] = (char) (random.nextInt(26) + 97);
                            }
                            if (letter == 1 || (letter == 2 && type == 1)) {
                                characters[i][j] = (char) (random.nextInt(26) + 65);
                            }
                        }
                        labels[i][j].setText("" + characters[i][j]);
                        if (color) {
                            labels[i][j].setForeground(new Color(random.nextInt(256), random.nextInt(256), random.nextInt(256)));
                        }
                    }
                }
                if (show) {
                    show = false;
                    StringBuilder sb = new StringBuilder();
                    for (char[] array : characters) {
                        for (char c : array) {
                            sb.append(c).append(" ");
                        }
                        sb.append(System.lineSeparator());
                    }
                    JOptionPane.showMessageDialog(null, new JTextArea(sb.toString()), title, JOptionPane.INFORMATION_MESSAGE);
                }
                while (pause) {
                    Thread.sleep(500);
                }
                Thread.sleep(Math.max(0, (1000000000 / framesPerSecond - (System.nanoTime() - start)) / 1000000));
                start = System.nanoTime();
            }
        }
    }

    private static String[] makeOptions(int limit) {
        String[] list = new String[limit];
        for (int i = 1; i <= limit; i++) {
            list[i - 1] = "" + i;
        }
        return list;
    }
}